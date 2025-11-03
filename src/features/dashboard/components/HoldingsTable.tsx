import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Holding } from "@/services/portfolio.api";

interface HoldingsTableProps {
	holdings: Holding[];
	loading?: boolean;
	error?: string | null;
}

export function HoldingsTable({
	holdings,
	loading,
	error,
}: HoldingsTableProps) {
	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center gap-2 pb-2">
				<CardTitle className="text-lg font-semibold">All Holdings</CardTitle>
			</CardHeader>
			<CardContent className="overflow-x-auto">
				{loading ? (
					<div className="w-full">
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
								{Array.from({ length: 6 }).map((_, i) => (
									<tr key={i}>
										<td className="p-2">
											<Skeleton className="h-4 w-32" />
										</td>
										<td className="p-2 text-right">
											<Skeleton className="h-4 w-16" />
										</td>
										<td className="p-2 text-right">
											<Skeleton className="h-4 w-20" />
										</td>
										<td className="p-2 text-right">
											<Skeleton className="h-4 w-16" />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : error ? (
					<div className="flex flex-1 flex-col items-center justify-center min-h-[200px]">
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
					<table className="min-w-full text-xs md:text-sm border-separate border-spacing-y-1">
						<thead>
							<tr className="text-muted-foreground border-b">
								<th className="font-medium text-left p-2">Name</th>
								<th className="font-medium text-right p-2">LTP</th>
								<th className="font-medium text-right p-2">Avg</th>
								<th className="font-medium text-right p-2">Day P&amp;L</th>
								<th className="font-medium text-right p-2">Overall</th>
								<th className="font-medium text-right p-2">Value</th>
							</tr>
						</thead>
						<tbody>
							{holdings.map((h) => (
								<tr
									key={h.symbol}
									className="border-b last:border-b-0 bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg"
								>
									<td className="p-2 min-w-[160px] rounded-l-lg align-top">
										<div className="flex flex-col min-w-0">
											<span className="font-medium truncate text-sm">
												{h.name}
											</span>
											<span className="text-xs text-muted-foreground mt-0.5">
												{h.type.toLowerCase()} &#8226; {h.quantity} shares
											</span>
										</div>
									</td>
									<td className="text-right align-middle p-2 tabular-nums">
										₹{h.ltp.toLocaleString()}
									</td>
									<td className="text-right align-middle p-2 tabular-nums">
										₹{h.avgPrice.toLocaleString()}
									</td>
									<td className="text-right p-2 tabular-nums align-top">
										<div className="flex flex-col items-end">
											<span>
												{h.dayPnl >= 0 ? "+" : ""}₹
												{h.dayPnl?.toLocaleString?.() ?? "-"}
											</span>
											<span
												className={
													h.dayPercent >= 0
														? "text-green-600 text-xs"
														: "text-red-600 text-xs"
												}
											>
												{h.dayPercent >= 0 ? "+" : ""}
												{h.dayPercent?.toFixed?.(2) ?? "-"}%
											</span>
										</div>
									</td>
									<td className="text-right p-2 tabular-nums align-top">
										<div className="flex flex-col items-end">
											<span>
												{h.overallPnl >= 0 ? "+" : ""}₹
												{h.overallPnl?.toLocaleString?.() ?? "-"}
											</span>
											<span
												className={
													h.overallPercent >= 0
														? "text-green-600 text-xs"
														: "text-red-600 text-xs"
												}
											>
												{h.overallPercent >= 0 ? "+" : ""}
												{h.overallPercent?.toFixed?.(2) ?? "-"}%
											</span>
										</div>
									</td>
									<td className="text-right p-2 tabular-nums align-top rounded-r-lg">
										<div className="flex flex-col items-end">
											<span>₹{h.currentValue.toLocaleString()}</span>
											<span className="text-xs text-muted-foreground">
												Invested: ₹{h.investedValue.toLocaleString()}
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</CardContent>
		</Card>
	);
}
