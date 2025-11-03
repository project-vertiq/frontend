"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const SECTOR_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
	"#d946ef",
];

interface Sector {
  name: string;
  value: number;
}

interface Portfolio {
  sectors: Sector[];
}

interface SectorBreakdownProps {
	sectorData?: any;
	error?: string | null;
	loading?: boolean;
}

export function SectorBreakdown({ sectorData, error, loading }: SectorBreakdownProps) {
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
						<BarChart3 className="text-primary w-5 h-5" /> Sector Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex flex-col items-center justify-center">
					<AlertTriangle className="text-red-500 mb-2" size={32} />
					<div className="text-center text-sm font-medium text-black">Something went wrong</div>
				</CardContent>
			</Card>
		);
	}
	if (!sectorData) {
		return (
			<Card className="h-[400px] flex flex-col">
				<CardHeader className="flex flex-row items-center gap-2 pb-2">
					<CardTitle className="text-lg flex items-center gap-2">
						<BarChart3 className="text-primary w-5 h-5" /> Sector Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
					No data available
				</CardContent>
			</Card>
		);
	}

	// Flatten all sectors from all portfolios
    const allSectors = sectorData.flatMap((p: Portfolio) => p.sectors);
    const total = allSectors.reduce((sum: number, d: Sector) => sum + d.value, 0);


	// Sort by value descending
	const sorted = [...allSectors].sort((a, b) => b.value - a.value);
	const top5 = sorted.slice(0, 5);
	const others = sorted.slice(5);
	const otherValue = others.reduce((sum, d) => sum + d.value, 0);
	const displaySectors = otherValue > 0
		? [...top5, { name: "Other", value: otherValue }]
		: top5;

	return (
		<Card className="h-[400px] flex flex-col">
			<CardHeader className="flex flex-row items-center gap-2 pb-2">
				<CardTitle className="text-lg flex items-center gap-2">
					<BarChart3 className="text-primary w-5 h-5" /> Sector Breakdown
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col items-center gap-4 justify-center" style={{ minHeight: 0 }}>
				{/* Fixed bar at top */}
				<div className="w-full flex justify-center">
					<div className="mb-6 flex h-4 w-full max-w-xl overflow-hidden rounded-full">
						{displaySectors.map((item, idx) => {
							const percent = (item.value / total) * 100;
							const isLast = idx === displaySectors.length - 1;
							const minWidth = 8; // px
							const width = isLast ? undefined : `max(${percent}%, ${minWidth}px)`;
							return (
								<Tooltip key={item.name}>
									<TooltipTrigger asChild>
										<div
											className="h-full relative group cursor-pointer"
											style={{
												width: isLast ? undefined : width,
												flex: isLast ? '1 1 0%' : undefined,
												background: SECTOR_COLORS[idx % SECTOR_COLORS.length],
												minWidth: minWidth,
											}}
										/>
									</TooltipTrigger>
									<TooltipContent side="top">
										<span className="font-medium">{item.name}</span>: {percent.toFixed(1)}% • ₹{item.value.toLocaleString()}
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</div>
				{/* Legend: always max 6, aligned vertically, with extra margin above */}
				<div className="w-full max-w-xl mx-auto flex flex-col gap-2 text-xs mt-6">
					{displaySectors.map((item, idx) => {
						const percent = (item.value / total) * 100;
						return (
							<div key={item.name} className="flex items-center gap-4">
								<div className="h-3 w-3 rounded-full" style={{ background: SECTOR_COLORS[idx % SECTOR_COLORS.length] }} />
								<div className="flex flex-1 items-center justify-between">
									<div>
										<p className="text-sm font-medium">{item.name}</p>
									</div>
									<div className="flex items-center gap-4">
										<span className="text-muted-foreground w-10 text-right text-xs">{percent.toFixed(0)}%</span>
										<span className="text-muted-foreground text-xs">₹{item.value.toLocaleString()}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
