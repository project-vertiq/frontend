"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
	"var(--chart-1)", // largecap
	"var(--chart-2)", // midcap
	"var(--chart-3)", // smallcap
	"var(--chart-4)", // other
];

interface AssetBreakdownProps {
  marketCapData?: any;
  error?: string | null;
  loading?: boolean;
}

export function AssetBreakdown({ marketCapData, error, loading }: AssetBreakdownProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="text-primary w-5 h-5" /> Asset Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <AlertTriangle className="text-red-500 mb-2" size={32} />
          <div className="text-center text-sm font-medium text-black">Something went wrong</div>
        </CardContent>
      </Card>
    );
  }
  if (!marketCapData) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="text-primary w-5 h-5" /> Asset Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }
  const data = [
    { name: "Large Cap", value: marketCapData.largecapPercent },
    { name: "Mid Cap", value: marketCapData.midcapPercent },
    { name: "Small Cap", value: marketCapData.smallcapPercent },
    { name: "Other", value: marketCapData.otherPercent },
  ];
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="text-primary w-5 h-5" /> Asset Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-stretch px-4 pt-2 pb-4 gap-2 min-h-0">
        <div className="w-full flex justify-center pt-2 pb-4">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={48}
                paddingAngle={2}
                stroke="var(--card)"
                labelLine={false}
                label={false}
              >
                {data.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${(+value).toLocaleString()}%`,
                  name,
                ]}
                contentStyle={{
                  fontSize: 13,
                  borderRadius: 8,
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex flex-col gap-2 text-xs items-stretch flex-1 pt-2">
          {data.map((item, idx) => {
            const percent = (item.value / totalValue) * 100;
            return (
              <div key={item.name} className="grid grid-cols-[18px_1fr_auto_12px_auto] items-center gap-x-2 min-w-0">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[idx % COLORS.length] }}
                />
                <span className="font-medium text-muted-foreground truncate">{item.name}</span>
                <span className="font-semibold tabular-nums whitespace-nowrap text-right">{item.value.toFixed(1)}%</span>
                <span className="mx-0 text-muted-foreground text-center">|</span>
                <span className="text-muted-foreground tabular-nums whitespace-nowrap text-left">{percent.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
