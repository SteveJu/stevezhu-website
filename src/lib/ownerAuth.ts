import { cookies } from 'next/headers';

export const ownerCookieName = 'stevezhu_owner_mode';

export const isOwnerUnlocked = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ownerCookieName)?.value === 'unlocked';
};
