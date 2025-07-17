import { DashboardSidebar } from "../components/DashboardSidebar";
import { ChartAreaInteractive } from "../components/ChartAreaInteractive.tsx";
import { SiteHeader } from "../components/SiteHeader.tsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PortfolioMetrics } from "../components/PortfolioMetrics";
import { BarInvestedWithdrawn } from "../components/BarInvestedWithdrawn";
import { AssetBreakdown } from "../components/AssetBreakdown";
import { SectorBreakdown } from "../components/SectorBreakdown";
import { TopHoldings } from "../components/TopHoldings";
import { Overview } from "../components/Overview";
import React, { useEffect, useState } from "react";
import { DashboardTabs } from "../components/DashboardTabs";
import { HoldingsTable } from "../components/HoldingsTable";
import { useAuth } from "@/contexts/AuthContext";
import { getPortfolioSummary, getSectorBreakdown, getHoldings } from "@/services/portfolio.api";
import type { PortfolioSummary, PortfolioSectorBreakdownResponse, Holding } from "@/services/portfolio.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { accessToken, user, setAccessToken } = useAuth();
  const [tab, setTab] = React.useState("overview");
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [sector, setSector] = useState<PortfolioSectorBreakdownResponse | null>(null);
  const [sectorError, setSectorError] = useState<string | null>(null);
  const [sectorLoading, setSectorLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [holdingsError, setHoldingsError] = useState<string | null>(null);
  const [holdingsLoading, setHoldingsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !user?.id) return;
    setSummaryLoading(true);
    setSummaryError(null);
    getPortfolioSummary(user.id, accessToken, setAccessToken)
      .then(setSummary)
      .catch((err) => {
        if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          setSummaryError((err as { message: string }).message);
        } else {
          setSummaryError('Failed to load portfolio summary');
        }
      })
      .finally(() => setSummaryLoading(false));
    setSectorLoading(true);
    setSectorError(null);
    getSectorBreakdown(user.id, accessToken, setAccessToken)
      .then(setSector)
      .catch((err) => {
        if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          setSectorError((err as { message: string }).message);
        } else {
          setSectorError('Failed to load sector breakdown');
        }
      })
      .finally(() => setSectorLoading(false));
    setHoldingsLoading(true);
    setHoldingsError(null);
    getHoldings(user.id, accessToken, setAccessToken)
      .then((res) => setHoldings(res.holdings))
      .catch((err) => setHoldingsError(err?.message || "Failed to load holdings"))
      .finally(() => setHoldingsLoading(false));
  }, [user]);

  if (summaryLoading && sectorLoading && holdingsLoading) {
    return (
      <div className="flex min-h-svh h-full w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col w-full">
          <div className="w-full px-2 md:px-4 xl:px-6 flex flex-col gap-2">
            <SiteHeader />
            <DashboardTabs value={tab} onChange={setTab} />
            <div className="flex flex-1 flex-col w-full">
              <div className="flex flex-1 flex-col gap-2 w-full">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
                  {/* Skeletons for all dashboard widgets */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-[120px] w-full rounded-md" />
                    ))}
                  </div>
                  <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-stretch mb-4">
                    <div className="min-w-0 flex flex-col md:basis-2/3 md:max-w-2/3 h-full">
                      <Skeleton className="h-64 w-full rounded-md" />
                    </div>
                    <div className="min-w-0 flex flex-col md:basis-1/3 md:max-w-1/3 h-full">
                      <Skeleton className="h-64 w-full rounded-md" />
                    </div>
                  </div>
                  <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
                    <div className="min-w-0 flex flex-col md:basis-1/3 md:max-w-1/3">
                      <Skeleton className="h-64 w-full rounded-md" />
                    </div>
                    <div className="min-w-0 flex flex-col md:basis-2/3 md:max-w-2/3">
                      <Skeleton className="h-64 w-full rounded-md" />
                    </div>
                  </div>
                  <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="min-w-0 flex flex-col md:basis-2/3 md:max-w-2/3">
                      <Skeleton className="h-40 w-full rounded-md" />
                    </div>
                    <div className="min-w-0 flex flex-col md:basis-1/3 md:max-w-1/3">
                      <Skeleton className="h-40 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-svh h-full w-full">
        <DashboardSidebar />
        {/* Main content with uniform horizontal padding */}
        <div className="flex-1 flex flex-col w-full">
          {/* Slightly reduced left/right padding for all content */}
          <div className="w-full px-2 md:px-4 xl:px-6 flex flex-col gap-2">
            <SiteHeader />
            <DashboardTabs value={tab} onChange={setTab} />
            {/* Tab content */}
            <div className="flex flex-1 flex-col w-full">
              <div className="flex flex-1 flex-col gap-2 w-full">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
                  {tab === "overview" && (
                    <>
                      {/* 1st row: Overview */}
                      <Overview {...(summary?.overview || {})} error={summaryError} loading={summaryLoading} />
                      {/* 2nd row: Portfolio Over Time & Metrics */}
                      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
                        <div className="min-w-0 flex flex-col md:basis-2/3 md:max-w-2/3 h-full">
                          <ChartAreaInteractive />
                        </div>
                        <div className="min-w-0 flex flex-col md:basis-1/3 md:max-w-1/3 h-full">
                          <PortfolioMetrics metrics={summary?.metrics} error={summaryError} />
                        </div>
                      </div>
                      {/* 3rd row: Asset Breakdown & Top Holdings */}
                      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="min-w-0 flex flex-col md:basis-1/3 md:max-w-1/3">
                          <AssetBreakdown marketCapData={summary?.marketCapData} error={summaryError} />
                        </div>
                        <div className="min-w-0 flex flex-col md:basis-2/3 md:max-w-2/3">
                          <TopHoldings holdings={holdings} loading={holdingsLoading} error={holdingsError} />
                        </div>
                      </div>
                      {/* 4th row: Invested vs Withdrawn & Sector Breakdown */}
                      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="min-w-0 flex flex-col md:basis-2/3 md:max-w-2/3">
                          <BarInvestedWithdrawn />
                        </div>
                        <div className="min-w-0 flex flex-col md:basis-1/3 md:max-w-1/3">
                          <SectorBreakdown sectorData={sector?.sectorData} error={sectorError} />
                        </div>
                      </div>
                    </>
                  )}
                  {tab === "holdings" && (
                    <div className="flex flex-1 flex-col w-full">
                      <div className="flex flex-col gap-4 md:gap-6 w-full">
                        {/* Overview cards on holdings tab */}
                        <Overview {...(summary?.overview || {})} error={summaryError} loading={summaryLoading} />
                        <HoldingsTable holdings={holdings} loading={holdingsLoading} error={holdingsError} />
                      </div>
                    </div>
                  )}
                  {/* Coming soon for other tabs */}
                  {tab !== "overview" && tab !== "holdings" && (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground text-lg font-medium min-h-[300px]">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
