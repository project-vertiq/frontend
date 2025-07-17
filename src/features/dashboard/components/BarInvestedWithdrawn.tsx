"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowDownUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./ArrowIcon";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "Invested vs Withdrawn Bar Chart";

const allData = {
  sixMonths: [
    { month: "January", invested: 186, withdrawn: 80 },
    { month: "February", invested: 305, withdrawn: 200 },
    { month: "March", invested: 237, withdrawn: 120 },
    { month: "April", invested: 73, withdrawn: 190 },
    { month: "May", invested: 209, withdrawn: 130 },
    { month: "June", invested: 214, withdrawn: 140 },
  ],
  threeMonths: [
    { month: "April", invested: 73, withdrawn: 190 },
    { month: "May", invested: 209, withdrawn: 130 },
    { month: "June", invested: 214, withdrawn: 140 },
  ],
  year: [
    { month: "July", invested: 150, withdrawn: 60 },
    { month: "August", invested: 180, withdrawn: 90 },
    { month: "September", invested: 200, withdrawn: 110 },
    { month: "October", invested: 220, withdrawn: 120 },
    { month: "November", invested: 250, withdrawn: 130 },
    { month: "December", invested: 270, withdrawn: 140 },
    { month: "January", invested: 186, withdrawn: 80 },
    { month: "February", invested: 305, withdrawn: 200 },
    { month: "March", invested: 237, withdrawn: 120 },
    { month: "April", invested: 73, withdrawn: 190 },
    { month: "May", invested: 209, withdrawn: 130 },
    { month: "June", invested: 214, withdrawn: 140 },
  ],
};

const timeframeOptions = [
  { value: "threeMonths", label: "Last 3 Months" },
  { value: "sixMonths", label: "Last 6 Months" },
  { value: "year", label: "Last 1 Year" },
];

const chartConfig = {
  invested: {
    label: "Invested",
    color: "var(--chart-1)",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "var(--chart-2)",
  },
} as const;

interface BarInvestedWithdrawnProps {
  loading?: boolean;
}

export function BarInvestedWithdrawn({ loading }: BarInvestedWithdrawnProps) {
  const [timeframe, setTimeframe] = React.useState<keyof typeof allData>("sixMonths");
  const [startIdx, setStartIdx] = React.useState(0);
  const chartData = allData[timeframe];
  const maxVisible = 6;
  const canScrollLeft = startIdx > 0;
  const canScrollRight = chartData.length > maxVisible && startIdx + maxVisible < chartData.length;
  const visibleData = chartData.slice(startIdx, startIdx + maxVisible);

  function handleLeft() {
    if (canScrollLeft) setStartIdx(startIdx - 1);
  }
  function handleRight() {
    if (canScrollRight) setStartIdx(startIdx + 1);
  }
  React.useEffect(() => { setStartIdx(0); }, [timeframe]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowDownUp className="text-primary w-5 h-5" /> Invested vs Withdrawn
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select value={timeframe} onValueChange={v => setTimeframe(v as keyof typeof allData)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center relative" style={{ height: 240 }}>
        <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
          <button
            onClick={handleLeft}
            disabled={!canScrollLeft}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-secondary text-secondary-foreground hover:bg-secondary/80 size-8 shadow-none md:size-7"
            aria-label="Previous"
          >
            <ArrowLeftIcon />
          </button>
          <button
            onClick={handleRight}
            disabled={!canScrollRight}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-secondary text-secondary-foreground hover:bg-secondary/80 size-8 shadow-none md:size-7"
            aria-label="Next"
          >
            <ArrowRightIcon />
          </button>
        </div>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={visibleData} barCategoryGap="30%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <Legend content={<ChartLegendContent config={chartConfig} className="justify-center w-full" />} />
              <Tooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="invested" fill="var(--chart-1)" radius={3} barSize={18} />
              <Bar dataKey="withdrawn" fill="var(--chart-2)" radius={3} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
