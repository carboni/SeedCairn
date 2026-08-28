import { Platform } from 'react-native';
import NfcManager, { Ndef, NfcError, NfcTech } from 'react-native-nfc-manager';

let started = false;

export function nfcAvailableOnPlatform(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

async function ensureStarted(): Promise<void> {
  if (started) return;
  await NfcManager.start();
  started = true;
}

/** Whether NFC hardware is present and switched on for this device. */
export async function isNfcReady(): Promise<boolean> {
  if (!nfcAvailableOnPlatform()) return false;
  await ensureStarted();
  if (!(await NfcManager.isSupported())) return false;
  return NfcManager.isEnabled();
}

/**
 * True for a session that ended because the user didn't present a tag in
 * time or dismissed the system NFC sheet — not a real write failure, so
 * callers can quietly re-arm instead of showing an error.
 */
export function isBenignNfcAbort(error: unknown): boolean {
  return error instanceof NfcError.UserCancel || error instanceof NfcError.Timeout;
}

/**
 * Waits for a tag, writes `text` to it as a single NDEF text record, then
 * releases the NFC session. Rejects on cancellation, timeout, or a tag that
 * can't be written to — see `isBenignNfcAbort` to tell the harmless cases
 * apart from a real failure.
 */
export async function writeTextToTag(text: string): Promise<void> {
  await ensureStarted();
  await NfcManager.requestTechnology(NfcTech.Ndef);
  try {
    const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
  } finally {
    await NfcManager.cancelTechnologyRequest();
  }
}

/**
 * Waits for a tag, reads its first NDEF text record, then releases the NFC
 * session. Rejects on cancellation, timeout, or a tag with no readable text
 * record — see `isBenignNfcAbort` to tell the harmless cases apart from a
 * real failure.
 */
export async function readTextFromTag(): Promise<string> {
  await ensureStarted();
  await NfcManager.requestTechnology(NfcTech.Ndef);
  try {
    const tag = await NfcManager.ndefHandler.getNdefMessage();
    const record = tag?.ndefMessage?.[0];
    if (!record) throw new Error('No NDEF text record found on that card.');
    return Ndef.text.decodePayload(Uint8Array.from(record.payload));
  } finally {
    await NfcManager.cancelTechnologyRequest();
  }
}

/** Releases any in-progress NFC session — call this on unmount / navigating away. */
export async function cancelNfcWrite(): Promise<void> {
  if (!nfcAvailableOnPlatform()) return;
  try {
    await NfcManager.cancelTechnologyRequest();
  } catch {
    // No session was in progress.
  }
}
