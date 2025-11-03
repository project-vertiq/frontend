import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortfolioMetrics as PortfolioMetricsType } from "@/services/portfolio.api";

interface PortfolioMetricsProps {
  metrics?: Partial<PortfolioMetricsType>;
  error?: string | null;
  loading?: boolean;
}

function displayValue(val: number | undefined | null, digits = 2) {
  if (val === undefined || val === null || isNaN(val)) return "-";
  return Number(val).toFixed(digits);
}

export function PortfolioMetrics({ metrics, error, loading }: PortfolioMetricsProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded" />
        ))}
      </div>
    );
  }

  const metricsRows = [
    [
      { label: "Avg. Market Cap", value: metrics?.avgMarketCap !== undefined ? metrics.avgMarketCap.toLocaleString() : "-" },
      { label: "Risk Label", value: metrics?.riskLabel || "-" },
    ],
    [
      { label: "P/E", value: displayValue(metrics?.avgPE) },
      { label: "Industry P/E", value: displayValue(metrics?.industryPE) },
    ],
    [
      { label: "P/B", value: displayValue(metrics?.priceBook) },
      { label: "Industry P/B", value: displayValue(metrics?.industryPB) },
    ],
    [
      { label: "Div Yield", value: displayValue(metrics?.divYield) },
      { label: "EPS", value: displayValue(metrics?.eps) },
    ],
    [
      { label: "ROE", value: displayValue(metrics?.roe) },
      { label: "ROCE", value: displayValue(metrics?.roce) },
    ],
    [
      { label: "Alpha", value: displayValue(metrics?.alpha) },
      { label: "Beta", value: displayValue(metrics?.beta) },
    ],
  ];

  return (
    <Card className="min-h-[420px] max-h-[520px] flex flex-col min-w-0 overflow-x-auto">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="text-primary" /> Portfolio Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 sm:px-4 md:px-8 flex-1 flex flex-col justify-center min-w-0 overflow-x-auto h-full">
        {error ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <AlertTriangle className="text-red-500 mb-2" size={32} />
            <div className="text-center text-sm font-medium text-black">Something went wrong</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 min-w-0 h-full justify-center">
            {metricsRows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1 min-w-0">
                {row.map((m) => (
                  <div key={m.label} className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-muted-foreground font-medium truncate">{m.label}</span>
                    <span className="text-base font-semibold truncate">{m.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
