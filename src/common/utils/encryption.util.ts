// src/common/utils/encryption.util.ts

import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey =
  process.env.ONBOARD_SECRET_KEY || 'fallback-32-byte-long-secret-key!'; // must be 32 chars
const ivLength = 16;

export function encryptPayload(payload: object): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload)),
    cipher.final(),
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptPayload(token: string): any {
  const [ivHex, encrypted] = token.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv,
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString());
}
