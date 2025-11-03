import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Link2, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrokerSummary } from '@/services/broker.api';

interface BrokerCardProps {
  broker?: BrokerSummary;
  onConnect?: () => void;
  onRefresh?: () => void;
  onDisconnect?: () => void;
  loading?: boolean;
}

const statusIconMap = {
  connected: <CheckCircle2 className="size-4 text-green-600" />,
  not_connected: <XCircle className="size-4 text-red-500" />,
};
const statusBgMap = {
  connected: "bg-green-100",
  not_connected: "bg-red-100",
};

function formatDateTime(dateString?: string | null) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

const BrokerCard: React.FC<BrokerCardProps> = ({ broker, onConnect, onRefresh, onDisconnect, loading }) => {
  if (loading) {
    return (
      <div className="bg-card flex flex-col gap-0 rounded-xl border py-4 shadow-sm w-full h-[180px] justify-between overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 px-5 pb-0">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5 px-5 mt-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between gap-0 border-t pt-2 px-5 mt-2 h-9">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-8 rounded mx-2" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="bg-card flex flex-col gap-0 rounded-xl border py-4 shadow-sm w-full h-[180px] justify-center items-center">
        <span className="text-muted-foreground">No broker data available</span>
      </div>
    );
  }

  // Derive status from broker.status (set in API layer based on isConnected)
  const status = broker.status === 'connected' ? 'connected' : 'not_connected';
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-0 rounded-xl border py-4 shadow-sm w-full h-[180px] justify-between overflow-hidden">
      {/* Header: Logo, Title, Status icon right-aligned */}
      <div className="flex items-center gap-3 px-5 pb-0">
        <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted">
          <img className="aspect-square size-full object-contain" alt={broker.name} src={broker.logoUrl} />
        </span>
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center min-w-0 gap-2 justify-between">
            <h3 className="truncate text-card-foreground text-base leading-6 font-semibold">{broker.name}</h3>
            <span className={`flex items-center justify-center rounded-full ${statusBgMap[status]} transition-colors size-6`}>
              {statusIconMap[status]}
            </span>
          </div>
        </div>
      </div>
      {/* Details: Last Sync, Expiry */}
      <div className="flex flex-col gap-0.5 px-5 mt-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-h-[22px]">
          <span className="font-medium text-foreground">Last Sync:</span>
          {formatDateTime(broker.lastSyncAt)
            ? <span className="truncate max-w-[120px]" title={broker.lastSyncAt}>{formatDateTime(broker.lastSyncAt)}</span>
            : <span className="inline-block w-4 text-center text-zinc-400 text-base align-middle">--</span>
          }
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-h-[22px]">
          <span className="font-medium text-foreground">Expiry:</span>
          {formatDateTime(broker.nextSyncAt)
            ? <span className="truncate max-w-[120px]" title={broker.nextSyncAt || undefined}>{formatDateTime(broker.nextSyncAt)}</span>
            : <span className="inline-block w-4 text-center text-zinc-400 text-base align-middle">--</span>
          }
        </div>
      </div>
      {/* Footer: Connect/Disconnect (left), vertical separator, Refresh (right) */}
      <div className="flex items-center justify-between gap-0 border-t pt-2 px-5 mt-2 h-9">
        <Button
          onClick={status === "connected" ? onDisconnect : onConnect}
          size="sm"
          variant="ghost"
          className={`gap-1 flex-1 h-8 ${status === "connected" ? "text-destructive hover:bg-destructive/10" : ""}`}
        >
          {status === "connected" ? <><LogOut size={16} /> Disconnect</> : <><Link2 size={16} /> Connect</>}
        </Button>
        <Separator orientation="vertical" className="mx-2 h-6 w-px bg-border" />
        <Button
          onClick={onRefresh}
          size="sm"
          variant="ghost"
          className="gap-1 flex-1 h-8"
          disabled={status !== "connected"}
          title="Refresh"
        >
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>
    </Card>
  );
};

export default BrokerCard;