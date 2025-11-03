import React, { useState } from "react";
import BrokerCard from "../components/BrokerCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { SiteHeader } from "@/features/dashboard/components/SiteHeader";
import * as ReactTabs from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  listBrokers,
  getBrokerConsentUrl,
  syncBrokerData,
  disconnectBroker,
} from "@/services/broker.api";
import { Skeleton } from '@/components/ui/skeleton';
import type { BrokerSummary } from '@/services/broker.api';
import upstoxLogo from '/assets/upstox_only_logo.jpeg';
import zerodhaLogo from '/assets/zerodha_only_logo.jpeg';
import growwLogo from '/assets/groww_only_logo.png';
import angelOneLogo from '/assets/angelone_only_logo.jpeg';
import genericLogo from '/assets/only_logo_black.svg';

const brokerTabs = [
  { label: "All", value: "all" },
  { label: "Connected", value: "connected" },
  { label: "Disconnected", value: "disconnected" },
];

const LOGO_MAP: Record<string, string> = {
  UPST: upstoxLogo,
  ZERO: zerodhaLogo,
  GROW: growwLogo,
  ANGE: angelOneLogo,
};

const BrokersPage: React.FC = () => {
  const { accessToken, user, setAccessToken } = useAuth();
  const [brokers, setBrokers] = useState<BrokerSummary[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserId = (user: { id: string } | null | undefined) => {
    return user?.id || sessionStorage.getItem('vertiq_user_id') || '';
  };

  React.useEffect(() => {
    const userId = getUserId(user);
    if (!accessToken || !userId) return;
    setLoading(true);
    setError(null);
    listBrokers(accessToken, userId, setAccessToken)
      .then((data) => {
        const apiBrokers = data.brokers;
        const mapped = (apiBrokers as Array<any>).map(b => ({
          ...b,
          name: b.brokerName,
          lastSyncAt: b.lastSync,
          nextSyncAt: b.expiry,
          logoUrl: LOGO_MAP[b.brokerId] || genericLogo,
          status: b.isConnected ? 'connected' : 'not_connected',
        }));
        setBrokers(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load brokers. Please try again.');
        setBrokers([]);
        setLoading(false);
      });
  }, [user]);

  function getErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string') {
      return (err as { message: string }).message;
    }
    return fallback;
  }

  const handleConnect = async (broker: BrokerSummary) => {
    const userId = getUserId(user);
    if (!accessToken || !userId) return;
    try {
      const { authorizationUrl } = await getBrokerConsentUrl(broker.brokerId, accessToken, userId, setAccessToken);
      const url = new URL(authorizationUrl);
      // Larger, landscape popup, centered, with scrollbars and resizable, minimal browser UI
      const popupWidth = 900;
      const popupHeight = 700;
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;
      const popup = window.open(
        url.toString(),
        'broker-oauth',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no`
      );
      if (!popup) throw new Error('Popup blocked. Please allow popups and try again.');
      window.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'broker-oauth' && event.data.code && event.data.state) {
          const brokerId = broker?.brokerId;
          if (!brokerId) {
            return;
          }
          try {
            const userId = getUserId(user);
            await fetch(`https://api-gateway-7hr4.onrender.com/broker-integration/v1/${brokerId}/callback`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-User-Id': userId,
              },
              body: JSON.stringify({ code: event.data.code, state: event.data.state }),
            });
            const data = await listBrokers(accessToken, userId, setAccessToken);
            const apiBrokers = data.brokers;
            const mapped = (apiBrokers as Array<any>).map(b => ({
              ...b,
              name: b.brokerName,
              lastSyncAt: b.lastSync,
              nextSyncAt: b.expiry,
              logoUrl: LOGO_MAP[b.brokerId] || genericLogo,
              status: b.isConnected ? 'connected' : 'not_connected',
            }));
            setBrokers(mapped);
          } catch {}
        }
      }, { once: true });
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to get consent URL'));
    }
  };

  const handleRefresh = async (broker: BrokerSummary) => {
    const userId = getUserId(user);
    if (!accessToken || !userId) return;
    try {
      await syncBrokerData(broker.brokerId, accessToken, userId, setAccessToken);
      const data = await listBrokers(accessToken, userId, setAccessToken);
      const apiBrokers = data.brokers;
      const mapped = (apiBrokers as Array<any>).map(b => ({
        ...b,
        name: b.brokerName,
        lastSyncAt: b.lastSync,
        nextSyncAt: b.expiry,
        logoUrl: LOGO_MAP[b.brokerId] || genericLogo,
        status: b.isConnected ? 'connected' : 'not_connected',
      }));
      setBrokers(mapped);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to sync broker'));
    }
  };

  const handleDisconnect = async (broker: BrokerSummary) => {
    const userId = getUserId(user);
    if (!accessToken || !userId) return;
    try {
      await disconnectBroker(broker.brokerId, accessToken, userId, setAccessToken);
      const data = await listBrokers(accessToken, userId, setAccessToken);
      const apiBrokers = data.brokers;
      const mapped = (apiBrokers as Array<any>).map(b => ({
        ...b,
        name: b.brokerName,
        lastSyncAt: b.lastSync,
        nextSyncAt: b.expiry,
        logoUrl: LOGO_MAP[b.brokerId] || genericLogo,
        status: b.isConnected ? 'connected' : 'not_connected',
      }));
      setBrokers(mapped);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to disconnect broker'));
    }
  };

  const filteredBrokers = tab === 'all'
    ? brokers
    : brokers.filter((b) => (tab === 'connected' ? b.status === 'connected' : b.status !== 'connected'));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col w-full overflow-x-hidden overflow-y-auto">
          <div className="w-full px-2 md:px-4 xl:px-6 flex flex-col gap-2">
            <SiteHeader title="Brokers" />
            <ReactTabs.Tabs value={tab} onValueChange={setTab} className="mb-4">
              <ReactTabs.TabsList>
                {brokerTabs.map((t) => (
                  <ReactTabs.TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="capitalize"
                  >
                    {t.label}
                  </ReactTabs.TabsTrigger>
                ))}
              </ReactTabs.TabsList>
            </ReactTabs.Tabs>
            <div className="grid gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-start">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
                ))
              ) : error ? (
                <div className="col-span-full text-center text-red-500 py-8">{error}</div>
              ) : filteredBrokers.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">No brokers found.</div>
              ) : (
                filteredBrokers.map((broker) => (
                  <BrokerCard
                    key={broker.brokerId}
                    broker={broker}
                    onConnect={() => handleConnect(broker)}
                    onRefresh={() => handleRefresh(broker)}
                    onDisconnect={() => handleDisconnect(broker)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BrokersPage;
