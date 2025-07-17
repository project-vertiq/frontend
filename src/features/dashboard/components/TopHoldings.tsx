"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { BarChart3 } from "lucide-react";
import type { Holding } from "@/services/portfolio.api";
import { Skeleton } from "@/components/ui/skeleton";

interface TopHoldingsProps {
	holdings: Holding[];
	loading?: boolean;
	error?: string | null;
}

export function TopHoldings({ holdings, loading, error }: TopHoldingsProps) {
	// Defensive: ensure holdings is always an array
	const safeHoldings = Array.isArray(holdings) ? holdings : [];
	// Sort by currentValue descending and take top 5
	const topHoldings = [...safeHoldings]
		.sort((a, b) => b.currentValue - a.currentValue)
		.slice(0, 5);

	return (
		<Card className="h-[400px] flex flex-col">
			<CardHeader className="flex flex-row items-center gap-2 pb-1">
				<BarChart3 className="text-primary w-5 h-5" />
				<CardTitle className="text-lg font-semibold">Top 5 Holdings</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col gap-2 justify-start px-2 pt-0">
				{loading ? (
					<div className="flex flex-col gap-2 mt-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center gap-2 p-2">
								<Skeleton className="h-8 w-8 rounded-full" />
								<div className="flex-1">
									<Skeleton className="h-4 w-32 mb-1" />
									<Skeleton className="h-3 w-20" />
								</div>
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-16" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
						<span className="mb-2 text-red-500">
							<svg
								width="32"
								height="32"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="lucide lucide-alert-triangle"
								viewBox="0 0 24 24"
							>
								<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
								<line x1="12" x2="12" y1="9" y2="13"></line>
								<line x1="12" x2="12.01" y1="17" y2="17"></line>
							</svg>
						</span>
						<div className="text-center text-sm font-medium text-black">
							Something went wrong
						</div>
					</div>
				) : (
					<div className="overflow-x-auto mt-1">
						<table className="min-w-full text-xs md:text-sm border-separate border-spacing-y-1">
							<thead>
								<tr className="text-muted-foreground border-b">
									<th className="font-medium text-left p-2">Name</th>
									<th className="font-medium text-right p-2">LTP</th>
									<th className="font-medium text-right p-2">Value</th>
									<th className="font-medium text-right p-2">Returns</th>
								</tr>
							</thead>
							<tbody>
								{topHoldings.map((h) => (
									<tr
										key={h.symbol}
										className="border-b last:border-b-0 bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg"
									>
										<td className="flex items-center gap-2 p-2 min-w-[120px] rounded-l-lg">
											<div className="flex flex-col min-w-0">
												<span className="font-medium truncate text-sm">
													{h.name}
												</span>
												<span className="text-xs text-muted-foreground">
													{h.symbol} &#8226; {h.type}
												</span>
											</div>
										</td>
										<td className="text-right p-2 tabular-nums">
											₹{h.ltp.toLocaleString()}
										</td>
										<td className="text-right p-2 tabular-nums">
											₹{h.currentValue.toLocaleString()}
										</td>
										<td
											className={
												"text-right p-2 tabular-nums font-semibold rounded-r-lg " +
												(h.overallPercent >= 0
													? "text-green-600"
													: "text-red-600")
											}
										>
											{h.overallPercent >= 0 ? "+" : ""}
											{h.overallPercent.toFixed(1)}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
