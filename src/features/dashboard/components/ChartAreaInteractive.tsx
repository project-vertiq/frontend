"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "./ArrowIcon";
import { CartesianGrid, Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import React from "react"
import { LineChart as LineChartIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartLegendContent } from "@/components/ui/chart"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export const description = "A multiple line chart"

// Generate more realistic data for each timeframe
const today = new Date("2024-06-01");
function getPastDates(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return d;
  });
}
function getPastMonths(months: number) {
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(today);
    d.setMonth(today.getMonth() - (months - 1 - i));
    return d;
  });
}
function randomValue(base: number, spread: number) {
  return Math.round(base + (Math.random() - 0.5) * spread);
}

const weekData = getPastDates(7).map((d) => ({
  date: d.toISOString().slice(0, 10),
  desktop: randomValue(200, 100),
  mobile: randomValue(150, 80),
}));
const monthData = getPastDates(30).map((d) => ({
  date: d.toISOString().slice(0, 10),
  desktop: randomValue(200, 100),
  mobile: randomValue(150, 80),
}));
const sixMonthData = getPastMonths(6).map((d) => ({
  date: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
  desktop: randomValue(250, 120),
  mobile: randomValue(180, 90),
}));
const yearData = getPastMonths(12).map((d) => ({
  date: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
  desktop: randomValue(250, 120),
  mobile: randomValue(180, 90),
}));
const allTimeData = [
  { date: "Jan '23", desktop: 120, mobile: 80 },
  { date: "Feb '23", desktop: 140, mobile: 90 },
  { date: "Mar '23", desktop: 180, mobile: 110 },
  { date: "Apr '23", desktop: 200, mobile: 120 },
  { date: "May '23", desktop: 220, mobile: 130 },
  { date: "Jun '23", desktop: 210, mobile: 120 },
  { date: "Jul '23", desktop: 230, mobile: 140 },
  { date: "Aug '23", desktop: 250, mobile: 150 },
  { date: "Sep '23", desktop: 240, mobile: 145 },
  { date: "Oct '23", desktop: 260, mobile: 160 },
  { date: "Nov '23", desktop: 270, mobile: 170 },
  { date: "Dec '23", desktop: 280, mobile: 175 },
  { date: "Jan '24", desktop: 300, mobile: 180 },
  { date: "Feb '24", desktop: 320, mobile: 190 },
  { date: "Mar '24", desktop: 340, mobile: 200 },
  { date: "Apr '24", desktop: 360, mobile: 210 },
  { date: "May '24", desktop: 380, mobile: 220 },
  { date: "Jun '24", desktop: 400, mobile: 230 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineMultiple() {
  const dataMap = {
    week: weekData,
    month: monthData,
    sixMonths: sixMonthData,
    year: yearData,
    all: allTimeData,
  } as const;
  type Timeframe = keyof typeof dataMap;
  const [timeframe, setTimeframe] = React.useState<Timeframe>("month");
  const timeframeOptions = [
    { value: "week", label: "1 Week" },
    { value: "month", label: "1 Month" },
    { value: "sixMonths", label: "6 Months" },
    { value: "year", label: "1 Year" },
    { value: "all", label: "All Time" },
  ];

  // Navigation logic for visible window
  const maxVisible = 6;
  const chartData = dataMap[timeframe];
  const [startIdx, setStartIdx] = React.useState(0);
  const canScrollLeft = startIdx > 0;
  const canScrollRight = chartData.length > maxVisible && startIdx + maxVisible < chartData.length;
  const visibleData = chartData.slice(startIdx, startIdx + maxVisible);
  React.useEffect(() => { setStartIdx(0); }, [timeframe]);

  function handleLeft() {
    if (canScrollLeft) setStartIdx(startIdx - 1);
  }
  function handleRight() {
    if (canScrollRight) setStartIdx(startIdx + 1);
  }

  return (
    <Card className="min-h-[320px] max-h-[480px] flex flex-col min-w-0 overflow-x-auto h-full">
      <CardHeader className="flex flex-row items-center gap-2 pb-1">
        <CardTitle className="text-lg flex items-center gap-2">
          <LineChartIcon className="text-primary w-5 h-5" /> Portfolio Over Time
        </CardTitle>
        <div className="flex items-center gap-2 ml-auto">
          <Select value={timeframe} onValueChange={v => setTimeframe(v as Timeframe)}>
            <SelectTrigger className="w-32">
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
      <CardContent className="pt-6 pb-4 px-2 sm:px-6 md:px-10 flex-1 flex flex-col justify-center min-w-0 overflow-x-auto relative">
        <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
          <button
            onClick={handleLeft}
            disabled={!canScrollLeft}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-secondary text-secondary-foreground hover:bg-secondary/80 size-8 shadow-none md:size-7"
            aria-label="Previous"
            style={{ pointerEvents: 'auto' }}
          >
            <ArrowLeftIcon />
          </button>
          <button
            onClick={handleRight}
            disabled={!canScrollRight}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-secondary text-secondary-foreground hover:bg-secondary/80 size-8 shadow-none md:size-7"
            aria-label="Next"
            style={{ pointerEvents: 'auto' }}
          >
            <ArrowRightIcon />
          </button>
        </div>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={310}>
            <LineChart
              accessibilityLayer
              data={visibleData}
              margin={{
                top: 24,
                bottom: 24,
                left: 24,
                right: 24,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fontSize: 12 }}
                interval={0}
                tickFormatter={(value) => {
                  // Show 'DD MMM' for week/month, 'MMM YY' for 6 months/year/all
                  if (/\d{4}-\d{2}-\d{2}/.test(value)) {
                    const d = new Date(value);
                    if (timeframe === "week" || timeframe === "month") {
                      return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                    } else {
                      return `${d.toLocaleString('default', { month: 'short' })} '${String(d.getFullYear()).slice(-2)}`;
                    }
                  }
                  // If already in 'Mon YY' or 'Mon' format, return as is
                  return value;
                }}
              />
              <Legend content={<ChartLegendContent config={chartConfig} className="justify-center w-full" />} />
              <Tooltip content={<ChartTooltipContent />} cursor={false} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ChartAreaInteractive() {
  return <ChartLineMultiple />;
}
