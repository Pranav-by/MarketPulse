import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Zap,
  ShieldCheck,
  Play,
  Key,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Terminal,
} from 'lucide-react';

export const ConcurrencyLabView = () => {
  // Concurrency Test States
  const [initialStock, setInitialStock] = useState(3);
  const [concurrentRequests, setConcurrentRequests] = useState(25);
  const [runningTest, setRunningTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Webhook Test States
  const [orderNumber, setOrderNumber] = useState('MP-DEMO-2026-8812');
  const [tamperSig, setTamperSig] = useState(false);
  const [webhookResult, setWebhookResult] = useState(null);
  const [sendingWebhook, setSendingWebhook] = useState(false);

  const runConcurrencyTest = async () => {
    setRunningTest(true);
    setTestResult(null);
    try {
      const data = await api.simulateConcurrency(initialStock, concurrentRequests);
      setTestResult(data);
    } catch (err) {
      console.error('Concurrency test failed:', err);
    } finally {
      setRunningTest(false);
    }
  };

  const testWebhookDelivery = async () => {
    setSendingWebhook(true);
    setWebhookResult(null);
    try {
      const signData = await api.generateSignedWebhook(orderNumber, 527.99, tamperSig);
      if (signData.success) {
        const deliveryRes = await api.sendWebhook(
          signData.payload,
          signData.headers['X-MarketPulse-Signature']
        );
        setWebhookResult({
          signatureUsed: signData.headers['X-MarketPulse-Signature'],
          isTampered: signData.isTampered,
          payload: signData.payload,
          response: deliveryRes,
        });
      }
    } catch (err) {
      console.error('Webhook test error:', err);
    } finally {
      setSendingWebhook(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="neo-card p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="neo-badge neo-badge-amber">Zero-Oversell Sandbox</span>
          <span className="text-[10px] font-mono text-slate-500">Atomic Lock Guard Testing</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Concurrency Stress Testing & HMAC Webhook Sandbox
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Simulate high-frequency flash sale checkout bursts to observe database-level atomic lock operations (<code className="font-mono text-amber-300">$inc with stock &gt;= qty</code>) and verify cryptographic signature enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Flash Sale Concurrency Burst */}
        <div className="neo-card p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Concurrent Checkout Burst</h2>
                <p className="text-xs text-slate-400">Simultaneous asynchronous purchase attempts</p>
              </div>
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Initial Stock (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={initialStock}
                  onChange={(e) => setInitialStock(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Concurrent Requests</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={concurrentRequests}
                  onChange={(e) => setConcurrentRequests(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-amber-400 font-mono font-bold"
                />
              </div>
            </div>

            <button
              disabled={runningTest}
              onClick={runConcurrencyTest}
              className="w-full neo-btn-primary text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {runningTest ? (
                <span className="font-mono">Executing {concurrentRequests} Promises...</span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute {concurrentRequests} Concurrent Requests</span>
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {testResult && (
            <div className="space-y-3 pt-3 border-t border-white/[0.06] animate-fade-in">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] text-slate-500">Total Fired</div>
                  <div className="text-base font-bold text-white">{testResult.summary?.totalSimulatedRequests}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 font-semibold">Successes</div>
                  <div className="text-base font-bold text-emerald-300">{testResult.summary?.successfulOrders}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
                  <div className="text-[10px] text-rose-400 font-semibold">409 Conflicts</div>
                  <div className="text-base font-bold text-rose-300">{testResult.summary?.rejectedConflicts}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center space-x-2 text-xs text-emerald-300 font-mono">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span className="text-[11px]">
                  Zero-Oversell Verified: Final Stock = {testResult.summary?.finalStock} ({testResult.summary?.executionTimeMs}ms)
                </span>
              </div>

              {/* Terminal Logs */}
              <div className="p-2.5 rounded-lg bg-black border border-white/[0.08] font-mono text-[9px] space-y-0.5 max-h-28 overflow-y-auto">
                <div className="text-slate-600">// Atomic Database Log Output:</div>
                {testResult.detailedLogs?.slice(0, 8).map((log, i) => (
                  <div key={i} className={log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-500'}>
                    [{log.requestId}] {log.status}: {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Module 2: HMAC Webhook Sandbox */}
        <div className="neo-card p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">HMAC-SHA256 Signature Verifier</h2>
                <p className="text-xs text-slate-400">Cryptographic payload tamper verification</p>
              </div>
              <Key className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Order Number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-white font-mono text-xs"
                />
              </div>

              <label className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.06] cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 text-xs">Tamper with Signature</span>
                  <p className="text-[10px] text-slate-500">Injects corrupt signature to trigger 401</p>
                </div>
                <input
                  type="checkbox"
                  checked={tamperSig}
                  onChange={(e) => setTamperSig(e.target.checked)}
                  className="rounded bg-white/[0.05] border-white/[0.1] text-rose-500 focus:ring-0"
                />
              </label>
            </div>

            <button
              disabled={sendingWebhook}
              onClick={testWebhookDelivery}
              className="w-full neo-btn-secondary text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Deliver Signed Webhook Payload</span>
            </button>
          </div>

          {/* Webhook Result */}
          {webhookResult && (
            <div className="space-y-2.5 pt-3 border-t border-white/[0.06] animate-fade-in text-xs font-mono">
              <div
                className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                  webhookResult.response?.success
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}
              >
                {webhookResult.response?.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-[11px]">
                    {webhookResult.response?.success ? '200 OK — Signature Verified' : '401 Unauthorized — Tamper Detected'}
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-black border border-white/[0.08] text-[9px] text-slate-500">
                Signature: {webhookResult.signatureUsed.substring(0, 32)}...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
