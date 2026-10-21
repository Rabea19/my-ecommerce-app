import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export const digest = value => createHash('sha256').update(value).digest('hex');
export async function hashPassword(password) { const salt = randomBytes(16).toString('hex'); return `${salt}:${(await scrypt(password, salt, 64)).toString('hex')}`; }
export async function verifyPassword(password, stored) { const [salt, hash] = stored.split(':'); const actual = await scrypt(password, salt, 64); return timingSafeEqual(actual, Buffer.from(hash, 'hex')); }
export function credentials(body) { if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || body.email.length > 254 || typeof body.password !== 'string' || body.password.length < 10 || body.password.length > 128) { throw Object.assign(new Error('Use a valid email and a password of 10–128 characters.'), { status: 400 }); } return { email: body.email.trim().toLowerCase(), password: body.password }; }
export function fail(status, message) { throw Object.assign(new Error(message), { status }); }
