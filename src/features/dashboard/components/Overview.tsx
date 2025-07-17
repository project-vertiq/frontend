import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp, TrendingDown, Percent, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewProps {
  currentValue?: number;
  investedValue?: number;
  totalReturns?: number;
  totalReturnsPercent?: number;
  todaysReturns?: number;
  todaysReturnsPercent?: number;
  xirr?: number;
  error?: string | null;
  loading?: boolean;
}

export function Overview({
  currentValue,
  investedValue,
  totalReturns,
  totalReturnsPercent,
  todaysReturns,
  todaysReturnsPercent,
  xirr,
  error,
  loading,
}: OverviewProps) {
  const totalReturnsPositive = (totalReturns ?? 0) >= 0;
  const todaysReturnsPositive = (todaysReturns ?? 0) >= 0;

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="text-red-500 mb-2" size={32} />
            <div className="text-center text-sm font-medium text-black">Something went wrong</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Value Card */}
      <Card className="group bg-card text-card-foreground border rounded-md shadow-xs transition-colors hover:bg-muted/60 h-full">
        <CardHeader className="flex flex-row items-center justify-between px-6 pb-2 pt-6">
          <CardTitle className="text-base font-semibold tracking-tight">Total Value</CardTitle>
          <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chart-1)]/20 group-hover:bg-[var(--chart-1)]/30 transition-colors">
            <IndianRupee className="size-4 text-[var(--chart-1)]" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2 space-y-1">
          <div className="font-display text-2xl font-bold tabular-nums">₹{currentValue?.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Invested: <span className="font-medium">₹{investedValue?.toLocaleString()}</span>
          </p>
        </CardContent>
      </Card>
      {/* Total Returns Card */}
      <Card className="group bg-card text-card-foreground border rounded-md shadow-xs transition-colors hover:bg-muted/60 h-full">
        <CardHeader className="flex flex-row items-center justify-between px-6 pb-2 pt-6">
          <CardTitle className="text-base font-semibold tracking-tight">Total Returns</CardTitle>
          <div className={`flex size-9 items-center justify-center rounded-full transition-colors p-0.5 ${totalReturnsPositive ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-100 group-hover:bg-red-200'}`}>
            {totalReturnsPositive ? (
              <TrendingUp className="size-4 text-green-600" />
            ) : (
              <TrendingDown className="size-4 text-red-600" />
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2 space-y-1">
          <div className="font-display text-2xl font-bold tabular-nums">₹{totalReturns?.toLocaleString()}</div>
          <p className="text-xs mt-1">
            <span className={totalReturnsPositive ? "text-green-600" : "text-red-600"}>
              {totalReturnsPercent!>= 0 ? "+" : ""}{totalReturnsPercent}%
            </span> overall
          </p>
        </CardContent>
      </Card>
      {/* Today's Returns Card */}
      <Card className="group bg-card text-card-foreground border rounded-md shadow-xs transition-colors hover:bg-muted/60 h-full">
        <CardHeader className="flex flex-row items-center justify-between px-6 pb-2 pt-6">
          <CardTitle className="text-base font-semibold tracking-tight">Today's Returns</CardTitle>
          <div className={`flex size-9 items-center justify-center rounded-full transition-colors p-0.5 ${todaysReturnsPositive ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-100 group-hover:bg-red-200'}`}>
            {todaysReturnsPositive ? (
              <TrendingUp className="size-4 text-green-600" />
            ) : (
              <TrendingDown className="size-4 text-red-600" />
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2 space-y-1">
          <div className="font-display text-2xl font-bold tabular-nums">₹{todaysReturns?.toLocaleString()}</div>
          <p className="text-xs mt-1">
            <span className={todaysReturnsPositive ? "text-green-600" : "text-red-600"}>
              {todaysReturnsPercent!>= 0 ? "+" : ""}{todaysReturnsPercent}%
            </span> today
          </p>
        </CardContent>
      </Card>
      {/* XIRR Card */}
      <Card className="group bg-card text-card-foreground border rounded-md shadow-xs transition-colors hover:bg-muted/60 h-full">
        <CardHeader className="flex flex-row items-center justify-between px-6 pb-2 pt-6">
          <CardTitle className="text-base font-semibold tracking-tight">XIRR</CardTitle>
          <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chart-4)]/20 group-hover:bg-[var(--chart-4)]/30 transition-colors">
            <Percent className="size-4 text-[var(--chart-4)]" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2 space-y-1">
          <div className="font-display text-2xl font-bold tabular-nums">{xirr}%</div>
          <p className="text-xs text-muted-foreground mt-1">Annualized returns</p>
        </CardContent>
      </Card>
    </div>
  );
}
