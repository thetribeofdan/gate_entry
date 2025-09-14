// src/common/utils/encryption.util.ts

import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

const algorithm = 'aes-256-cbc';
const secretKey =
  process.env.ONBOARD_SECRET_KEY || 'fallback-32-byte-long-secret-key';
const ivLength = 16;

console.log(secretKey);

export function encryptPayload(payload: object): string {
  const iv = crypto.randomBytes(ivLength);
  const key = Buffer.from(secretKey, 'hex');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload)),
    cipher.final(),
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptPayload(token: string): any {
  const [ivHex, encrypted] = token.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(secretKey, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString());
}
