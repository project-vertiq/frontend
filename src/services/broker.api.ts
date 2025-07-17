// Vertiq Broker Integration Service API
// See OpenAPI spec for details

import { fetchWithAuthRetry } from "./fetchWithAuthRetry.js";

const BASE_URL = 'http://localhost:8080/broker-integration/v1';

export interface BrokerSummary {
  brokerId: string;
  name: string;
  logoUrl: string;
  status: 'connected' | 'not_connected';
  connectedAt?: string;
  lastSyncAt?: string;
  nextSyncAt?: string | null;
}

export interface BrokersResponse {
  brokers: BrokerSummary[];
}

export interface ConsentUrlResponse {
  authorizationUrl: string;
}

export interface CallbackRequest {
  code: string;
  state: string;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export async function listBrokers(accessToken: string, userId: string, setAccessToken: (token: string) => void): Promise<BrokersResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/brokers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Id': userId,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw { status: 401, message: 'Unauthorized' };
        }
        throw await res.json();
      }
      return res.json();
    },
    accessToken,
    setAccessToken
  );
}

export async function getBrokerConsentUrl(brokerId: string, accessToken: string, userId: string, setAccessToken: (token: string) => void): Promise<ConsentUrlResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/${brokerId}/connect`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Id': userId,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw { status: 401, message: 'Unauthorized' };
        }
        throw await res.json();
      }
      return res.json();
    },
    accessToken,
    setAccessToken
  );
}

export async function handleBrokerCallback(brokerId: string, data: CallbackRequest, accessToken: string, userId: string, setAccessToken: (token: string) => void): Promise<GenericResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/${brokerId}/callback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Id': userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw { status: 401, message: 'Unauthorized' };
        }
        throw await res.json();
      }
      return res.json();
    },
    accessToken,
    setAccessToken
  );
}

export async function syncBrokerData(brokerId: string, accessToken: string, userId: string, setAccessToken: (token: string) => void): Promise<GenericResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/${brokerId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Id': userId,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw { status: 401, message: 'Unauthorized' };
        }
        throw await res.json();
      }
      return res.json();
    },
    accessToken,
    setAccessToken
  );
}

export async function disconnectBroker(brokerId: string, accessToken: string, userId: string, setAccessToken: (token: string) => void): Promise<GenericResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/${brokerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Id': userId,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw { status: 401, message: 'Unauthorized' };
        }
        throw await res.json();
      }
      return res.json();
    },
    accessToken,
    setAccessToken
  );
}
