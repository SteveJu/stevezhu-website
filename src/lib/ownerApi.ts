import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from './ownerAuth';

export const unauthorizedOwnerResponse = () => {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
};

export const requireOwner = async () => {
  return (await isOwnerUnlocked()) ? null : unauthorizedOwnerResponse();
};
