import { APIRequestContext } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export interface UserCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResult {
  token: string;
  userId: number;
  email: string;
  password: string;
}

/**
 * Log in with the given credentials and return the bearer token + userId.
 * Throws if the login request does not return HTTP 200.
 */
export async function login(
  request: APIRequestContext,
  baseURL: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const res = await request.post(`${baseURL}/auth/login`, {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status() !== 200) {
    throw new Error(
      `Login failed for ${email}: HTTP ${res.status()} – ${await res.text()}`,
    );
  }

  const body = await res.json();
  return { token: body.token, userId: body.userId, email, password };
}

/**
 * Register a brand-new user and immediately log them in, returning their token.
 * Each call generates a unique email to guarantee isolation across tests.
 */
export async function registerAndLogin(
  request: APIRequestContext,
  baseURL: string,
  overrides?: Partial<UserCredentials>,
): Promise<AuthResult> {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const email = overrides?.email ?? `testuser_${suffix}@example.com`;
  const password = overrides?.password ?? 'TestPass123!';
  const name = overrides?.name ?? `Test User ${suffix}`;

  const regRes = await request.post(`${baseURL}/auth/register`, {
    data: { email, password, name },
    headers: { 'Content-Type': 'application/json' },
  });

  if (regRes.status() !== 201) {
    throw new Error(
      `Registration failed for ${email}: HTTP ${regRes.status()} – ${await regRes.text()}`,
    );
  }

  return login(request, baseURL, email, password);
}

/**
 * Log in with the pre-seeded admin account defined in environment variables.
 */
export async function loginAsAdmin(
  request: APIRequestContext,
  baseURL: string,
): Promise<AuthResult> {
  const email = process.env.ADMIN_EMAIL ?? 'admin@shopeasy.com';
  const password = process.env.ADMIN_PASSWORD ?? 'password123';
  return login(request, baseURL, email, password);
}
