import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  BACKUP_DRILL_CHANNEL_ID,
  BACKUP_DRILL_NOTIFICATION_ID,
  nextAnnualDrillDate,
  notificationsAreAllowed,
  scheduleAnnualBackupDrillReminder,
  yearlyTriggerFromDate,
} from '../backup-drill-reminder';

jest.mock('expo-notifications', () => ({
  IosAuthorizationStatus: {
    NOT_DETERMINED: 0,
    DENIED: 1,
    AUTHORIZED: 2,
    PROVISIONAL: 3,
    EPHEMERAL: 4,
  },
  PermissionStatus: {
    GRANTED: 'granted',
    UNDETERMINED: 'undetermined',
    DENIED: 'denied',
  },
  AndroidImportance: {
    DEFAULT: 5,
  },
  SchedulableTriggerInputTypes: {
    YEARLY: 'yearly',
  },
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

const getPermissionsAsync = Notifications.getPermissionsAsync as jest.Mock;
const requestPermissionsAsync = Notifications.requestPermissionsAsync as jest.Mock;
const cancelAllScheduledNotificationsAsync =
  Notifications.cancelAllScheduledNotificationsAsync as jest.Mock;
const dismissAllNotificationsAsync = Notifications.dismissAllNotificationsAsync as jest.Mock;
const scheduleNotificationAsync = Notifications.scheduleNotificationAsync as jest.Mock;
const setNotificationChannelAsync = Notifications.setNotificationChannelAsync as jest.Mock;

function grantedStatus(
  overrides: Partial<Notifications.NotificationPermissionsStatus> = {},
): Notifications.NotificationPermissionsStatus {
  return {
    status: Notifications.PermissionStatus.GRANTED,
    granted: true,
    canAskAgain: true,
    expires: 'never',
    ...overrides,
  };
}

function deniedStatus(): Notifications.NotificationPermissionsStatus {
  return {
    status: Notifications.PermissionStatus.DENIED,
    granted: false,
    canAskAgain: false,
    expires: 'never',
  };
}

describe('nextAnnualDrillDate', () => {
  test('adds one calendar year, keeping the clock time', () => {
    const next = nextAnnualDrillDate(new Date(2026, 7, 20, 21, 6, 30));
    expect(next.getFullYear()).toBe(2027);
    expect(next.getMonth()).toBe(7);
    expect(next.getDate()).toBe(20);
    expect(next.getHours()).toBe(21);
    expect(next.getMinutes()).toBe(6);
    expect(next.getSeconds()).toBe(30);
  });

  test('rolls Feb 29 forward in a non-leap year', () => {
    const next = nextAnnualDrillDate(new Date(2024, 1, 29, 12, 0, 0));
    expect(next.getFullYear()).toBe(2025);
    expect(next.getMonth()).toBe(2);
    expect(next.getDate()).toBe(1);
  });
});

describe('yearlyTriggerFromDate', () => {
  test('uses JS Date month indexing', () => {
    expect(yearlyTriggerFromDate(new Date(2027, 7, 20, 21, 6))).toEqual({
      type: 'yearly',
      month: 7,
      day: 20,
      hour: 21,
      minute: 6,
      channelId: BACKUP_DRILL_CHANNEL_ID,
    });
  });
});

describe('notificationsAreAllowed', () => {
  test('accepts granted and iOS provisional', () => {
    expect(notificationsAreAllowed(grantedStatus())).toBe(true);
    expect(
      notificationsAreAllowed(
        grantedStatus({
          granted: false,
          status: Notifications.PermissionStatus.UNDETERMINED,
          ios: { status: Notifications.IosAuthorizationStatus.PROVISIONAL } as never,
        }),
      ),
    ).toBe(true);
    expect(notificationsAreAllowed(deniedStatus())).toBe(false);
  });
});

describe('scheduleAnnualBackupDrillReminder', () => {
  const originalOs = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', { configurable: true, get: () => 'ios' });
    cancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);
    dismissAllNotificationsAsync.mockResolvedValue(undefined);
    scheduleNotificationAsync.mockResolvedValue(BACKUP_DRILL_NOTIFICATION_ID);
    setNotificationChannelAsync.mockResolvedValue(null);
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, get: () => originalOs });
  });

  test('skips the permission prompt when already granted, then replaces notifications', async () => {
    getPermissionsAsync.mockResolvedValue(grantedStatus());

    await expect(scheduleAnnualBackupDrillReminder()).resolves.toBe('scheduled');

    expect(requestPermissionsAsync).not.toHaveBeenCalled();
    expect(cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(dismissAllNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    expect(scheduleNotificationAsync.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        identifier: BACKUP_DRILL_NOTIFICATION_ID,
        trigger: expect.objectContaining({ type: 'yearly' }),
      }),
    );
  });

  test('requests permission when it has not been granted yet', async () => {
    getPermissionsAsync.mockResolvedValue({
      status: Notifications.PermissionStatus.UNDETERMINED,
      granted: false,
      canAskAgain: true,
      expires: 'never',
    });
    requestPermissionsAsync.mockResolvedValue(grantedStatus());

    await expect(scheduleAnnualBackupDrillReminder()).resolves.toBe('scheduled');

    expect(requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(scheduleNotificationAsync).toHaveBeenCalledTimes(1);
  });

  test('does not schedule when permission is denied', async () => {
    getPermissionsAsync.mockResolvedValue(deniedStatus());
    requestPermissionsAsync.mockResolvedValue(deniedStatus());

    await expect(scheduleAnnualBackupDrillReminder()).resolves.toBe('denied');

    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(cancelAllScheduledNotificationsAsync).not.toHaveBeenCalled();
  });

  test('is unavailable on web', async () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, get: () => 'web' });

    await expect(scheduleAnnualBackupDrillReminder()).resolves.toBe('unavailable');

    expect(getPermissionsAsync).not.toHaveBeenCalled();
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
