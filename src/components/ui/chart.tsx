import * as React from "react";

export type ChartConfig = Record<string, { label: string; color?: string }>;

export function ChartContainer({ config, className, children }: { config: ChartConfig; className?: string; children: React.ReactNode }) {
  // For now, just a styled div wrapper
  return <div className={className}>{children}</div>;
}

export function ChartLegend({ content }: { content: React.ReactNode }) {
  return <div className="flex gap-4 mt-2">{content}</div>;
}

export function ChartLegendContent({ config, className }: { config: ChartConfig; className?: string }) {
  return (
    <div className={"flex gap-4 justify-center w-full mt-2 " + (className ?? "")}> {/* Restore previous top margin */}
      {Object.entries(config).map(([key, { label, color }]) => (
        <div key={key} className="flex items-center gap-2">
          <span style={{ background: color, width: 12, height: 12, display: 'inline-block', borderRadius: '50%' }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

interface TooltipEntry {
  color: string;
  dataKey: string;
  name: string;
  value: number;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

export function ChartTooltip({ content }: { content: React.ReactNode }) {
  // Just render children for now
  return content;
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border bg-card p-2 shadow-sm text-xs">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span style={{ background: entry.color, width: 10, height: 10, display: 'inline-block', borderRadius: '50%' }} />
          <span>{entry.name}: <b>{entry.value}</b></span>
        </div>
      ))}
    </div>
  );
}
