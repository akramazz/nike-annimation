import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "@/models/User";
import Session from "@/models/Session";

const SALT_ROUNDS = 12;
const SESSION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string, token: string) {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await Session.create({ userId, tokenHash, expiresAt });
}

export async function getCurrentUserFromToken(token: string | undefined) {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const session = await Session.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  session.lastUsedAt = new Date();
  await session.save();
  const user = await User.findById(session.userId).select("-passwordHash").lean();
  return user;
}

export async function deleteSession(token: string) {
  const tokenHash = hashToken(token);
  await Session.deleteOne({ tokenHash });
}

export async function deleteUserSessions(userId: string) {
  await Session.deleteMany({ userId });
}
