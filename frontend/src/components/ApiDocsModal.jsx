import React from 'react';
import {
  X,
  FileCode,
  Download,
} from 'lucide-react';

export const ApiDocsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const endpoints = [
    { method: 'POST', path: '/api/v1/auth/register', desc: 'Register customer or vendor account' },
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate with email and password to receive JWT' },
    { method: 'GET', path: '/api/v1/auth/me', desc: 'Retrieve authenticated profile and store data' },
    { method: 'GET', path: '/api/v1/products', desc: 'Multi-faceted catalog search with full-text indexing & filters' },
    { method: 'POST', path: '/api/v1/products', desc: 'Create new product listing (Vendor role)' },
    { method: 'POST', path: '/api/v1/orders', desc: 'Unified multi-vendor checkout with atomic stock reservation' },
    { method: 'GET', path: '/api/v1/orders/mine', desc: 'Fetch customer order history and partitioned fulfillments' },
    { method: 'GET', path: '/api/v1/vendor/dashboard', desc: 'Vendor earnings, sub-orders pipeline, and catalog stats' },
    { method: 'PATCH', path: '/api/v1/vendor/orders/:orderId/sub-orders/:subOrderId', desc: 'Fulfill sub-order and update tracking status' },
    { method: 'GET', path: '/api/v1/analytics/platform', desc: 'MongoDB aggregation pipeline for GMV, take-rate & leaderboard' },
    { method: 'POST', path: '/api/v1/webhooks/payment', desc: 'HMAC-SHA256 signature verified payment event ingress' },
  ];

  const handleDownloadPostman = () => {
    fetch('/marketpulse_postman_collection.json')
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marketpulse_postman_collection.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => console.error('Download failed:', err));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0d0f17] border border-white/[0.1] rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">API Reference & Postman Collection</h2>
              <p className="text-[10px] font-mono text-slate-500">RESTful v1 Endpoints</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Download Postman */}
        <div className="p-4 rounded-xl neo-card flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-white font-mono">Postman Collection v2.1</div>
            <p className="text-[11px] text-slate-400">Pre-configured requests with automated JWT token extraction.</p>
          </div>

          <button
            onClick={handleDownloadPostman}
            className="neo-btn-primary text-xs flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>

        {/* Endpoints List */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Mounted Endpoints</div>
          <div className="space-y-1.5">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`neo-badge ${
                      ep.method === 'GET'
                        ? 'neo-badge-indigo'
                        : ep.method === 'POST'
                        ? 'neo-badge-emerald'
                        : 'neo-badge-amber'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-slate-200">{ep.path}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
