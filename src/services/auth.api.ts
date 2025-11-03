// Vertiq Auth API integration
import type {
  SignupRequest,
  LoginRequest,
  OidcGoogleRequest,
  User,
  ErrorResponse
} from "@/types";

const BASE_URL = 'https://api-gateway-7hr4.onrender.com/auth/v1';

interface SignupResponse {
  message: string;
}

interface AuthWithUserResponse {
  accessToken: string;
  user: User;
}

interface LogoutResponse {
  message: string;
}

export async function signup(payload: SignupRequest): Promise<SignupResponse> {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw (await res.json()) as ErrorResponse;
  return res.json();
}

export async function login(payload: LoginRequest): Promise<AuthWithUserResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw (await res.json()) as ErrorResponse;
  return res.json();
}

export async function oidcGoogleLogin(payload: OidcGoogleRequest): Promise<AuthWithUserResponse> {
  const res = await fetch(`${BASE_URL}/oidc/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw (await res.json()) as ErrorResponse;
  return res.json();
}

export async function refreshToken(): Promise<AuthWithUserResponse> {
  const res = await fetch(`${BASE_URL}/refresh`, {
    method: 'GET',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
  });
  if (!res.ok) throw (await res.json()) as ErrorResponse;
  return res.json();
}

export async function logout(): Promise<LogoutResponse> {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'GET',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
  });
  if (!res.ok) throw (await res.json()) as ErrorResponse;
  return res.json();
}
