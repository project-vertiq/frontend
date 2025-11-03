

import { fetchWithAuthRetry } from "./fetchWithAuthRetry.js";

const BASE_URL = 'https://api-gateway-7hr4.onrender.com/portfolio';

export interface PortfolioOverview {
  currentValue: number;
  investedValue: number;
  totalReturns: number;
  totalReturnsPercent: number;
  todaysReturns: number;
  todaysReturnsPercent: number;
  xirr: number;
}

export interface PortfolioMetrics {
  avgMarketCap: number;
  avgPE: number;
  priceBook: number;
  alpha: number;
  beta: number;
  roe?: number; // Return on Equity
  roce?: number; // Return on Capital Employed
  divYield?: number; // Dividend Yield
  eps?: number; // Earnings Per Share
  riskLabel?: string; // Risk Label
  industryPE?: number; // Industry P/E
  industryPB?: number; // Industry P/B
}

export interface MarketCapData {
  smallcapPercent: number;
  midcapPercent: number;
  largecapPercent: number;
  otherPercent: number;
}

export interface PortfolioSummary {
  overview: PortfolioOverview;
  metrics: PortfolioMetrics;
  marketCapData: MarketCapData;
}

export interface SectorBreakdownEntry {
  name: string;
  value: number;
  percent: number;
}

export interface SectorData {
  portfolioId: string;
  sectors: SectorBreakdownEntry[];
}

export interface PortfolioSectorBreakdownResponse {
  sectorData: SectorData[];
}

export interface Holding {
  name: string;
  symbol: string;
  type: string;
  quantity: number;
  avgPrice: number;
  ltp: number;
  dayPnl: number;
  dayPercent: number;
  overallPnl: number;
  overallPercent: number;
  currentValue: number;
  investedValue: number;
}

export interface HoldingsResponse {
  holdings: Holding[];
}

export async function getPortfolioSummary(userId: string, accessToken: string, setAccessToken: (token: string) => void): Promise<PortfolioSummary> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/summary`, {
        headers: {
          'user-id': userId,
          'Authorization': `Bearer ${token}`,
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

export async function getSectorBreakdown(userId: string, accessToken: string, setAccessToken: (token: string) => void): Promise<PortfolioSectorBreakdownResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/sector-breakdown`, {
        headers: {
          'user-id': userId,
          'Authorization': `Bearer ${token}`,
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

export async function getHoldings(userId: string, accessToken: string, setAccessToken: (token: string) => void): Promise<HoldingsResponse> {
  return fetchWithAuthRetry(
    async (token) => {
      const res = await fetch(`${BASE_URL}/holdings`, {
        headers: {
          'user-id': userId,
          'Authorization': `Bearer ${token}`,
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
