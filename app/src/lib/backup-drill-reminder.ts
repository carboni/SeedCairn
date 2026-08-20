import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const BACKUP_DRILL_CHANNEL_ID = 'backup-drill';
export const BACKUP_DRILL_NOTIFICATION_ID = 'backup-drill-annual';

export type ScheduleBackupDrillResult = 'scheduled' | 'denied' | 'unavailable';

export function nextAnnualDrillDate(from: Date = new Date()): Date {
  const next = new Date(from.getTime());
  next.setFullYear(next.getFullYear() + 1);
  return next;
}

export function yearlyTriggerFromDate(date: Date): Notifications.YearlyTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.YEARLY,
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    channelId: BACKUP_DRILL_CHANNEL_ID,
  };
}

export function notificationsAreAllowed(
  settings: Notifications.NotificationPermissionsStatus,
): boolean {
  return (
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/**
 * Needed so a notification can still appear if it fires while the app is open.
 * Background / killed delivery is handled by the OS without this.
 */
export function registerBackupDrillNotificationHandler() {
  if (Platform.OS === 'web') {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Asks for local-notification permission if needed, then replaces any
 * scheduled or presented notifications with one yearly backup-drill reminder
 * firing 12 months from now.
 *
 * If permission is already granted, the OS dialog is not shown again —
 * `getPermissionsAsync` returns immediately and scheduling continues.
 */
export async function scheduleAnnualBackupDrillReminder(): Promise<ScheduleBackupDrillResult> {
  if (Platform.OS === 'web') {
    return 'unavailable';
  }

  // Android 13+ will not show the permission prompt until a channel exists.
  await Notifications.setNotificationChannelAsync(BACKUP_DRILL_CHANNEL_ID, {
    name: 'Backup drill',
    importance: Notifications.AndroidImportance.DEFAULT,
  });

  const existing = await Notifications.getPermissionsAsync();
  const settings = notificationsAreAllowed(existing)
    ? existing
    : await Notifications.requestPermissionsAsync();

  if (!notificationsAreAllowed(settings)) {
    return 'denied';
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();

  const fireAt = nextAnnualDrillDate();
  await Notifications.scheduleNotificationAsync({
    identifier: BACKUP_DRILL_NOTIFICATION_ID,
    content: {
      title: 'Time for a backup drill',
      body: 'Check that any three pieces still rebuild your seed phrase, long before you need them.',
    },
    trigger: yearlyTriggerFromDate(fireAt),
  });

  return 'scheduled';
}
