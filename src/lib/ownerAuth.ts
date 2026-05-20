import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const ownerCookieName = 'stevezhu_owner_mode';
export const ownerSessionMaxAgeMs = 12 * 60 * 60 * 1000;
export const ownerSessionMaxAgeSeconds = ownerSessionMaxAgeMs / 1000;

const signOwnerSession = (timestamp: number, secret: string) => {
  return createHmac('sha256', secret).update(String(timestamp)).digest('hex');
};

const isEqualSignature = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const createOwnerCookieValue = (secret: string) => {
  const timestamp = Date.now();
  return `${timestamp}.${signOwnerSession(timestamp, secret)}`;
};

const isValidOwnerCookieValue = (value: string | undefined, secret: string | undefined) => {
  if (!value || !secret) return false;

  const [timestampValue, signature] = value.split('.');
  const timestamp = Number(timestampValue);

  if (!timestampValue || !signature || !Number.isFinite(timestamp)) return false;
  if (Date.now() - timestamp > ownerSessionMaxAgeMs) return false;

  return isEqualSignature(signature, signOwnerSession(timestamp, secret));
};

export const isOwnerUnlocked = async () => {
  const cookieStore = await cookies();
  return isValidOwnerCookieValue(cookieStore.get(ownerCookieName)?.value, process.env.OWNER_PASSCODE);
};
