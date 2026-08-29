import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Store,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  X,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const OrdersHistoryView = ({ onGoToStore }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed delivery address / mind');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    if (!selectedOrderToCancel) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await api.cancelOrder(selectedOrderToCancel._id, cancelReason);
      if (res.success) {
        setCancelMessage(`Order #${selectedOrderToCancel.orderNumber} successfully cancelled. Full refund processed.`);
        setSelectedOrderToCancel(null);
        fetchOrders();
        setTimeout(() => setCancelMessage(null), 5000);
      } else {
        setCancelError(res.message || 'Failed to cancel order.');
      }
    } catch (err) {
      setCancelError(err.message || 'Network error while cancelling order.');
    } finally {
      setCancelling(false);
    }
  };

  const isEligibleForCancellation = (order) => {
    if (order.paymentStatus === 'REFUNDED' || order.paymentStatus === 'CANCELLED') return false;
    return !order.vendorSubOrders?.some((sub) => sub.status === 'SHIPPED' || sub.status === 'DELIVERED');
  };

  // Helper to determine active step in 4-step delivery pipeline
  const getTrackingStepIndex = (status) => {
    switch (status) {
      case 'PAID':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return -1;
      default:
        return 1;
    }
  };

  const trackingSteps = [
    { title: 'Order Placed', desc: 'Payment verified' },
    { title: 'Processing', desc: 'Merchant packing' },
    { title: 'In Transit', desc: 'Carrier dispatch' },
    { title: 'Delivered', desc: 'Package arrived' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 neo-card p-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="neo-badge neo-badge-indigo">Customer Portal</span>
            <span className="text-[10px] font-mono text-slate-500">Live Package Tracking</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">My Orders & Shipments</h1>
          <p className="text-xs text-slate-400">
            Real-time visual tracking steppers, carrier dispatch status, and self-service cancellations
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="neo-btn-secondary text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {cancelMessage && (
        <div className="p-4 rounded-xl neo-card border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{cancelMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="neo-card p-6 h-48 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 neo-card space-y-3">
          <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Place an order from verified merchants in the marketplace to track fulfillment here.
          </p>
          <button
            onClick={onGoToStore}
            className="neo-btn-primary text-xs inline-flex items-center space-x-1.5"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const cancellable = isEligibleForCancellation(order);
            const isCancelled = order.paymentStatus === 'REFUNDED' || order.paymentStatus === 'CANCELLED';

            // Calculate estimated delivery (created date + 3 days)
            const orderDate = new Date(order.createdAt);
            const estDelivery = new Date(orderDate);
            estDelivery.setDate(estDelivery.getDate() + 3);

            return (
              <div key={order._id} className="neo-card p-5 sm:p-6 space-y-5">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-mono font-bold text-white">#{order.orderNumber}</span>
                      <span
                        className={`neo-badge ${
                          isCancelled
                            ? 'neo-badge-rose'
                            : order.paymentStatus === 'PAID'
                            ? 'neo-badge-emerald'
                            : 'neo-badge-amber'
                        }`}
                      >
                        {isCancelled ? 'CANCELLED / REFUNDED' : order.paymentStatus}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Via {order.paymentMethod?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center space-x-3">
                      <span>Placed on {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span className="text-slate-300 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        <span>Est. Delivery: {estDelivery.toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-right">
                      <div className="text-base font-mono font-bold text-white">
                        ${order.totalAmount?.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {order.vendorSubOrders?.length} Vendor Fulfillments
                      </div>
                    </div>

                    {cancellable && (
                      <button
                        onClick={() => {
                          setSelectedOrderToCancel(order);
                          setCancelError(null);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center space-x-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-orders Partitioned View with Live Stepper */}
                <div className="space-y-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Vendor Dispatches & Delivery Timeline:
                  </div>

                  <div className="space-y-4">
                    {order.vendorSubOrders?.map((vso, idx) => {
                      const stepIdx = getTrackingStepIndex(vso.status);

                      return (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                          {/* Sub-order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.04] pb-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <Store className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-white">{vso.store?.name || 'Store Merchant'}</span>
                              <span className="text-slate-500 font-mono text-[10px]">
                                (${vso.subTotal?.toFixed(2)})
                              </span>
                            </div>

                            <span
                              className={`neo-badge ${
                                vso.status === 'DELIVERED'
                                  ? 'neo-badge-emerald'
                                  : vso.status === 'SHIPPED'
                                  ? 'neo-badge-indigo'
                                  : vso.status === 'CANCELLED'
                                  ? 'neo-badge-rose'
                                  : 'neo-badge-amber'
                              }`}
                            >
                              {vso.status}
                            </span>
                          </div>

                          {/* Visual Tracking Stepper Bar */}
                          {vso.status !== 'CANCELLED' && (
                            <div className="py-2">
                              <div className="relative flex items-center justify-between">
                                {/* Connecting Background Track */}
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/[0.08] -translate-y-1/2 z-0" />
                                
                                {/* Active Progress Track */}
                                <div
                                  className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                                  style={{
                                    width: `${((stepIdx - 1) / 3) * 100}%`,
                                  }}
                                />

                                {trackingSteps.map((s, sIdx) => {
                                  const isComplete = stepIdx > sIdx + 1;
                                  const isCurrent = stepIdx === sIdx + 1;

                                  return (
                                    <div key={sIdx} className="relative z-10 flex flex-col items-center">
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition ${
                                          isComplete
                                            ? 'bg-emerald-500 text-white'
                                            : isCurrent
                                            ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 ring-4 ring-emerald-500/10'
                                            : 'bg-[#10121a] text-slate-500 border border-white/[0.1]'
                                        }`}
                                      >
                                        {isComplete ? <Check className="w-3.5 h-3.5" /> : sIdx + 1}
                                      </div>
                                      <div className="text-center mt-1.5">
                                        <div className={`text-[11px] font-semibold ${isCurrent ? 'text-white' : isComplete ? 'text-slate-300' : 'text-slate-500'}`}>
                                          {s.title}
                                        </div>
                                        <div className="text-[9px] text-slate-500 hidden sm:block">{s.desc}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Carrier Tracking Badge */}
                          {vso.trackingNumber && (
                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center space-x-2">
                                <Truck className="w-4 h-4 text-emerald-400" />
                                <span className="text-slate-400">{vso.carrier || 'Courier Express'}:</span>
                                <span className="text-white font-bold">{vso.trackingNumber}</span>
                              </div>
                              <span className="text-[10px] text-emerald-400">Live Carrier Sync</span>
                            </div>
                          )}

                          {/* Items in this sub-order */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            {vso.items?.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/[0.04]">
                                <div className="flex items-center space-x-2.5">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-8 h-8 rounded-lg object-cover bg-white/[0.03]"
                                  />
                                  <span className="text-slate-200 line-clamp-1 max-w-[150px] font-medium">{item.title}</span>
                                </div>
                                <span className="font-mono text-slate-400 text-[11px]">
                                  {item.quantity}x • ${item.price.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {selectedOrderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setSelectedOrderToCancel(null)} />

          <div className="relative w-full max-w-md bg-[#0d0f17] border border-white/[0.1] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Cancel Order #{selectedOrderToCancel.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderToCancel(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cancelError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{cancelError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Are you sure you want to cancel this order? An automatic 100% refund of <strong className="text-white font-mono">${selectedOrderToCancel.totalAmount?.toFixed(2)}</strong> will be processed and reserved items will be put back in store inventory.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10121a] border border-white/[0.08] text-white text-xs"
                >
                  <option value="Changed delivery address / mind">Changed delivery address / mind</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Delivery speed not fast enough">Delivery speed not fast enough</option>
                  <option value="Other / Duplicate order">Other / Duplicate order</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Instant Stock Restoration & Reversal</span>
                </div>
                <p className="text-[10px]">
                  All {selectedOrderToCancel.items?.length} items will be atomically returned to active merchant catalog.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setSelectedOrderToCancel(null)}
                className="flex-1 neo-btn-secondary py-2 text-xs"
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
              >
                {cancelling ? (
                  <span>Processing Cancellation...</span>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
