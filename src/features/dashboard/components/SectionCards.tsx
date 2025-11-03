import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, BarChart2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface SectionCardsProps {
  loading?: boolean;
}

export function SectionCards({ loading }: SectionCardsProps) {
  if (loading) {
    return (
      <div className="flex flex-row gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded" />
        ))}
      </div>
    );
  }

  // Example values, replace with real data as needed
  const currentValue = 1250000;
  const investedValue = 1000000;
  const oneDayChange = 12000;
  const oneDayChangePercent = 0.96;
  const totalReturns = 250000;
  const totalReturnsPercent = 25;
  const xirr = 13.2;
  const walletBalance = 50000;
  const isGain = totalReturns >= 0;

  return (
    <Card className="p-0">
      <CardHeader className="pb-2 border-b flex flex-col items-start gap-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="text-primary" /> Portfolio Overview
        </CardTitle>
        {/* <CardDescription className="text-sm">A summary of your investment performance and wallet balance</CardDescription> */}
      </CardHeader>
      <CardContent className="pt-4 px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
          {/* Left: Current Value as title, value big, details below */}
          <div className="flex-1 flex flex-col justify-center min-w-0 gap-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <TrendingUp className="size-4 text-primary" /> Current Value
              </div>
            <div className="text-2xl font-bold tracking-tight mb-2">₹{currentValue.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-muted-foreground">1D Returns</div>
              <div className={oneDayChange >= 0 ? 'text-green-600 text-right' : 'text-red-600 text-right'}>
                {oneDayChange >= 0 ? '+' : ''}₹{oneDayChange.toLocaleString()} ({oneDayChangePercent >= 0 ? '+' : ''}{oneDayChangePercent}%)
              </div>
              <div className="text-muted-foreground">Invested</div>
              <div className="text-right font-medium">₹{investedValue.toLocaleString()}</div>
              <div className="text-muted-foreground">Total Returns</div>
              <div className={isGain ? 'text-green-600 text-right font-medium' : 'text-red-600 text-right font-medium'}>
                {isGain ? '+' : ''}₹{totalReturns.toLocaleString()} ({isGain ? '+' : ''}{totalReturnsPercent}%)
              </div>
            </div>
          </div>
          {/* Separator for desktop, hidden on mobile */}
          <div className="hidden md:flex items-center">
            <Separator orientation="vertical" className="h-32" />
          </div>
          {/* Right: XIRR and Wallet Balance stacked, no card */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 justify-center">
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <BarChart2 className="size-4 text-primary" /> XIRR
              </div>
              <div className="text-2xl font-bold">{xirr}%</div>
              {/* <div className="text-muted-foreground text-xs">Annualized returns</div> */}
            </div>
            <Separator orientation="horizontal" className="my-2" />
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Wallet className="size-4 text-primary" /> Wallet Balance
              </div>
              <div className="text-2xl font-bold">₹{walletBalance.toLocaleString()}</div>
              {/* <div className="text-muted-foreground text-xs">Available to invest</div> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}