import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  DollarSign,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { CreateProductModal } from './CreateProductModal';

export const VendorPortalView = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [subOrders, setSubOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, ordersRes] = await Promise.all([
        api.getVendorDashboard(),
        api.getVendorSubOrders(),
      ]);

      if (dashRes.success) setDashboard(dashRes);
      if (ordersRes.success) setSubOrders(ordersRes.subOrders || []);
    } catch (err) {
      console.error('Fetch vendor data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleStatusUpdate = async (orderId, subOrderId, newStatus) => {
    setUpdatingId(subOrderId);
    try {
      const tracking = 'TRK-' + Math.floor(100000 + Math.random() * 900000);
      const res = await api.updateSubOrderStatus(orderId, subOrderId, {
        status: newStatus,
        trackingNumber: tracking,
        carrier: 'FedEx Express',
      });
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Update status failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.role === 'customer') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
          <Store className="w-5 h-5" />
        </div>
        <h2 className="text-base font-bold text-white">Vendor Portal</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          This section is restricted to vendor accounts. Register as a vendor to access your store dashboard, manage products, and fulfill orders.
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
            <span className="neo-badge neo-badge-emerald">Vendor</span>
            <span className="text-[10px] text-slate-500">
              Commission: {((dashboard?.store?.commissionRate || 0.1) * 100).toFixed(0)}%
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{dashboard?.store?.name || 'My Store'}</h1>
          <p className="text-xs text-slate-400">
            Manage your products, fulfill orders, and track earnings
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="neo-btn-primary text-xs flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>

          <button
            onClick={fetchData}
            className="neo-btn-secondary text-xs flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bento KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Settled Payout Balance</div>
          <div className="text-xl font-black font-mono text-white">
            ${(dashboard?.stats?.currentBalance || 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-emerald-400">Available for payout</div>
        </div>

        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Lifetime Gross GMV</div>
          <div className="text-xl font-black font-mono text-white">
            ${(dashboard?.stats?.lifetimeSales || 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-slate-400">From customer sub-orders</div>
        </div>

        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pending Fulfillments</div>
          <div className="text-xl font-black font-mono text-amber-400">
            {dashboard?.stats?.pendingFulfillment || 0}
          </div>
          <div className="text-[10px] font-mono text-amber-400">Requires dispatch</div>
        </div>

        <div className="neo-card p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Catalog SKUs</div>
          <div className="text-xl font-black font-mono text-white">
            {dashboard?.stats?.productCount || 0}
          </div>
          <div className="text-[10px] font-mono text-slate-400">Products in catalog</div>
        </div>
      </div>

      {/* Partitioned Sub-Orders Pipeline */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Fulfillment Pipeline</h2>
            <p className="text-xs text-slate-400">Routed sub-orders requiring merchant fulfillment</p>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{subOrders.length} Sub-Orders</span>
        </div>

        {subOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">No sub-orders in pipeline.</div>
        ) : (
          <div className="space-y-3">
            {subOrders.map(({ orderId, orderNumber, createdAt, customerInfo, subOrder }) => (
              <div
                key={subOrder._id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.04] pb-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white">#{orderNumber}</span>
                    <span className="text-slate-400">• Customer: {customerInfo?.name}</span>
                  </div>
                  <span
                    className={`neo-badge ${
                      subOrder.status === 'DELIVERED'
                        ? 'neo-badge-emerald'
                        : subOrder.status === 'SHIPPED'
                        ? 'neo-badge-indigo'
                        : 'neo-badge-amber'
                    }`}
                  >
                    {subOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    {subOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img src={item.image} alt={item.title} className="w-7 h-7 rounded-md object-cover bg-white/[0.03]" />
                          <span className="text-slate-300 line-clamp-1 max-w-[140px]">{item.title}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[10px]">
                          {item.quantity}x • ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-black/30 border border-white/[0.04] flex flex-col justify-between space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Sub-Total:</span>
                      <span className="text-white">${subOrder.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Platform Take-Rate:</span>
                      <span className="text-rose-400">-${subOrder.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-white/[0.06] pt-1">
                      <span className="text-emerald-400">Net Proceeds:</span>
                      <span className="text-emerald-400">${subOrder.vendorPayout.toFixed(2)}</span>
                    </div>

                    <div className="pt-1">
                      {subOrder.status === 'PAID' && (
                        <button
                          disabled={updatingId === subOrder._id}
                          onClick={() => handleStatusUpdate(orderId, subOrder._id, 'PROCESSING')}
                          className="w-full py-1 rounded-md neo-btn-secondary text-[10px] font-mono"
                        >
                          Mark Processing
                        </button>
                      )}
                      {subOrder.status === 'PROCESSING' && (
                        <button
                          disabled={updatingId === subOrder._id}
                          onClick={() => handleStatusUpdate(orderId, subOrder._id, 'SHIPPED')}
                          className="w-full py-1 rounded-md neo-btn-primary text-[10px] font-mono"
                        >
                          Dispatch & Attach Tracking
                        </button>
                      )}
                      {subOrder.status === 'SHIPPED' && (
                        <button
                          disabled={updatingId === subOrder._id}
                          onClick={() => handleStatusUpdate(orderId, subOrder._id, 'DELIVERED')}
                          className="w-full py-1 rounded-md neo-btn-secondary text-[10px] font-mono"
                        >
                          Confirm Delivery
                        </button>
                      )}
                      {subOrder.status === 'DELIVERED' && (
                        <div className="text-center text-emerald-400 text-[10px] font-mono">
                          ✓ Settled & Complete
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={() => fetchData()}
      />
    </div>
  );
};
