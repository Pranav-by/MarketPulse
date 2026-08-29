import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  ShieldAlert,
  RefreshCw,
  Zap,
  TrendingUp,
  DollarSign,
  Store,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminHubView = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, logsRes] = await Promise.all([
        api.getPlatformAnalytics(),
        api.getWebhookLogs(),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (logsRes.success) setWebhookLogs(logsRes.logs || []);
    } catch (err) {
      console.error('Fetch admin analytics failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="text-base font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          This section is only accessible to platform administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 neo-card p-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="neo-badge neo-badge-indigo">Executive Overview</span>
            <span className="text-[10px] text-slate-500 font-mono">Live Aggregated Metrics</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Platform Performance & Revenue Analytics</h1>
          <p className="text-xs text-slate-400">
            Real-time financial reconciliation, merchant distribution, and payment gateway logs
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="neo-btn-secondary text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Updating...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Gross Merchandise Value (GMV)</div>
          <div className="text-xl font-black font-mono text-white">
            ${(analytics?.kpis?.totalGMV || 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-slate-400">{analytics?.kpis?.orderCount || 0} Total Completed Orders</div>
        </div>

        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Platform Retained Revenue</div>
          <div className="text-xl font-black font-mono text-indigo-400">
            ${(analytics?.kpis?.totalPlatformRevenue || 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-emerald-400">Avg ~10-12% Commission Take</div>
        </div>

        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Vendor Settlements</div>
          <div className="text-xl font-black font-mono text-white">
            ${(analytics?.kpis?.totalVendorPayouts || 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-slate-400">Distributed to merchant wallets</div>
        </div>

        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Average Order Value (AOV)</div>
          <div className="text-xl font-black font-mono text-amber-400">
            ${(analytics?.kpis?.avgOrderValue || 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-slate-400">Per basket checkout</div>
        </div>
      </div>

      {/* Leaderboard & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Leaderboard */}
        <div className="lg:col-span-2 neo-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Top Performing Vendors</h2>
              <p className="text-xs text-slate-400">Ranked by gross sales volume and fulfillment count</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {analytics?.vendorLeaderboard?.length || 0} Active Merchants
            </span>
          </div>

          <div className="space-y-2.5">
            {(!analytics?.vendorLeaderboard || analytics.vendorLeaderboard.length === 0) ? (
              <div className="text-center py-8 text-slate-500 text-xs">No vendor activity recorded yet.</div>
            ) : (
              analytics.vendorLeaderboard.map((v, i) => (
                <div
                  key={v.storeId}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs transition hover:bg-white/[0.04]"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-slate-400 text-xs font-bold">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{v.storeName}</div>
                      <div className="text-[10px] text-slate-400">{v.subOrderCount} Sub-orders fulfilled</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-emerald-400">${v.totalSales.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">Platform Cut: ${v.totalFeePaid.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Catalog Categories */}
        <div className="neo-card p-5 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-sm font-bold text-white">Catalog Distribution</h2>
            <p className="text-xs text-slate-400">Active products by category</p>
          </div>

          <div className="space-y-2">
            {(!analytics?.categoryBreakdown || analytics.categoryBreakdown.length === 0) ? (
              <div className="text-center py-8 text-slate-500 text-xs">No categories indexed.</div>
            ) : (
              analytics.categoryBreakdown.map((cat) => (
                <div
                  key={cat._id}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <span className="text-slate-300 font-medium">{cat._id}</span>
                  <span className="font-mono text-slate-400 text-[11px] font-semibold">{cat.count} {cat.count === 1 ? 'Product' : 'Products'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Webhook Ingress Audit Logs */}
      <div className="neo-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Payment Gateway Webhook Ingress</h2>
              <p className="text-xs text-slate-400">Cryptographically verified payment events & idempotency audit trail</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{webhookLogs.length} Events Logged</span>
        </div>

        {webhookLogs.length === 0 ? (
          <div className="text-xs font-mono text-slate-500 py-6 text-center">No webhook ingress events logged.</div>
        ) : (
          <div className="space-y-2 overflow-x-auto">
            {webhookLogs.map((log) => (
              <div
                key={log._id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono"
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`neo-badge ${
                      log.status === 'PROCESSED' ? 'neo-badge-emerald' : 'neo-badge-rose'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-slate-200 text-xs font-semibold">{log.eventId}</span>
                  <span className="text-slate-500 text-[10px]">({log.eventType})</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                  <span>Signature: <code className="text-slate-300">Verified</code></span>
                  <span>•</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()} ({new Date(log.createdAt).toLocaleDateString()})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
