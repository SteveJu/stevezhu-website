import { createHash, createHmac } from 'node:crypto';

const encoder = new TextEncoder();

const encodePath = (value: string) => value.split('/').map(encodeURIComponent).join('/');

const hmac = (key: Uint8Array | string, value: string) => {
  return createHmac('sha256', key).update(value).digest();
};

const hexHmac = (key: Uint8Array | string, value: string) => {
  return createHmac('sha256', key).update(value).digest('hex');
};

const getSigningKey = (secretAccessKey: string, date: string, region: string, service: string) => {
  const dateKey = hmac(`AWS4${secretAccessKey}`, date);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  return hmac(serviceKey, 'aws4_request');
};

const getR2Config = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }

  return {
    accessKeyId,
    bucket,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    publicUrl: publicUrl.replace(/\/$/, ''),
    region: 'auto',
    secretAccessKey,
  };
};

export const createR2PublicUrl = (storageKey: string) => {
  const config = getR2Config();
  if (!config) throw new Error('R2 is not configured.');

  return `${config.publicUrl}/${encodePath(storageKey)}`;
};

const createR2SignedUrl = (method: 'PUT' | 'DELETE', storageKey: string) => {
  const config = getR2Config();
  if (!config) throw new Error('R2 is not configured.');

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const shortDate = amzDate.slice(0, 8);
  const credentialScope = `${shortDate}/${config.region}/s3/aws4_request`;
  const signedHeaders = 'host';
  const host = new URL(config.endpoint).host;
  const canonicalUri = `/${config.bucket}/${encodePath(storageKey)}`;
  const credential = `${config.accessKeyId}/${credentialScope}`;
  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': credential,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': '900',
    'X-Amz-SignedHeaders': signedHeaders,
  });
  const canonicalQueryString = Array.from(queryParams.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    `host:${host}`,
    '',
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    createHash('sha256').update(encoder.encode(canonicalRequest)).digest('hex'),
  ].join('\n');
  const signingKey = getSigningKey(config.secretAccessKey, shortDate, config.region, 's3');
  const signature = hexHmac(signingKey, stringToSign);

  queryParams.set('X-Amz-Signature', signature);

  return {
    publicUrl: createR2PublicUrl(storageKey),
    storageKey,
    signedUrl: `${config.endpoint}${canonicalUri}?${queryParams.toString()}`,
  };
};

export const createR2UploadUrl = (storageKey: string, contentType: string) => {
  const signedUpload = createR2SignedUrl('PUT', storageKey);

  return {
    ...signedUpload,
    uploadUrl: signedUpload.signedUrl,
    contentType,
  };
};

export const deleteR2Object = async (storageKey: string) => {
  const signedDelete = createR2SignedUrl('DELETE', storageKey);
  const response = await fetch(signedDelete.signedUrl, { method: 'DELETE' });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete R2 object: ${response.status}`);
  }
};
