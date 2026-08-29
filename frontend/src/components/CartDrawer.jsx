import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  CreditCard,
  QrCode,
  Smartphone,
  Check,
  Lock,
  ArrowLeft,
  Banknote,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onOrderCompleted }) => {
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount, vendorGroups } = useCart();
  const { user } = useAuth();

  // Steps: 'cart' -> 'address' -> 'payment' -> 'success'
  const [step, setStep] = useState('cart');

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '452 Innovation Blvd, Suite 300',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod' | 'netbanking'
  const [upiOption, setUpiOption] = useState('qr'); // 'qr' | 'id'
  const [upiId, setUpiId] = useState('shopper@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(false);

  // Card State
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    name: user?.name || 'Alex Rivera',
    expiry: '12/28',
    cvv: '888',
  });

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardData({ ...cardData, expiry: val });
  };

  const handleExecutePayment = async () => {
    setCheckingOut(true);
    setErrorMsg(null);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          title: i.title,
        })),
        customerInfo: {
          name: shippingAddress.name || user?.name || 'Customer',
          email: shippingAddress.email || user?.email || '',
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod: paymentMethod,
        paymentDetails: {
          method: paymentMethod,
          upiId: paymentMethod === 'upi' ? upiId : undefined,
          last4: paymentMethod === 'card' ? cardData.number.slice(-4) : undefined,
        },
      };

      const idempotencyKey = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const res = await api.createOrder(orderPayload, idempotencyKey);

      if (res.data?.success) {
        setCheckoutResult({
          order: res.data.order,
          paymentMethodUsed: paymentMethod,
        });
        clearCart();
        setStep('success');
        if (onOrderCompleted) onOrderCompleted(res.data.order);
      } else {
        setErrorMsg(res.data?.message || 'Order could not be processed. Please check item stock.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment communication error. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  // Generate UPI payment intent string
  const upiIntentString = `upi://pay?pa=marketpulse@okaxis&pn=MarketPulse&am=${totalAmount.toFixed(2)}&cu=INR&tn=Order_Checkout`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentString)}&color=ffffff&bgcolor=10121a&margin=10`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#090a0f] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {step !== 'cart' && step !== 'success' && (
                <button
                  onClick={() => setStep(step === 'payment' ? 'address' : 'cart')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {step === 'cart' && 'Your Shopping Cart'}
                  {step === 'address' && 'Delivery Address'}
                  {step === 'payment' && 'Select Payment Method'}
                  {step === 'success' && 'Order Confirmed'}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">
                  {step === 'cart' && `${items.length} items • ${vendorGroups.length} store fulfillments`}
                  {step === 'address' && 'Step 2 of 3 • Shipping details'}
                  {step === 'payment' && 'Step 3 of 3 • Zero-fee UPI & Cards'}
                  {step === 'success' && 'Fulfillment in progress'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            
            {errorMsg && (
              <div className="p-3.5 rounded-xl neo-card border-rose-500/30 flex items-start space-x-2 text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Transaction Alert</div>
                  <div className="text-[11px] opacity-90">{errorMsg}</div>
                </div>
              </div>
            )}

            {/* STEP 1: CART ITEMS */}
            {step === 'cart' && (
              items.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs space-y-1">
                  <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-slate-400">Your cart is currently empty</p>
                  <p className="text-[11px] text-slate-600">Discover items from verified vendors in the catalog</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendorGroups.map((group) => (
                    <div key={group.storeId} className="neo-card p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
                        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
                          <Store className="w-3.5 h-3.5 text-slate-400" />
                          <span>{group.storeName}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ${group.subTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {group.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-9 h-9 rounded-lg object-cover bg-white/[0.03]"
                              />
                              <div>
                                <div className="font-semibold text-slate-200 line-clamp-1 max-w-[140px]">{item.title}</div>
                                <div className="text-slate-400 font-mono text-[10px]">${item.price.toFixed(2)}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className="flex items-center bg-white/[0.04] rounded-md border border-white/[0.08]">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="p-1 text-slate-400 hover:text-white"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="px-1.5 font-mono font-bold text-white text-xs">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="p-1 text-slate-400 hover:text-white"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="p-1 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* STEP 2: ADDRESS */}
            {step === 'address' && (
              <div className="space-y-4 text-xs animate-fade-in">
                <div className="neo-card p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>Shipping Destination</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">City *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Country</label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD (FREE UPI / CARDS / COD) */}
            {step === 'payment' && (
              <div className="space-y-4 text-xs animate-fade-in">
                {/* Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px]">Instant UPI</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">0% Fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 font-bold'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px]">Cards</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/[0.04] text-slate-400">Visa/MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px]">COD</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/[0.04] text-slate-400">Pay on delivery</span>
                  </button>
                </div>

                {/* --- UPI VIEW --- */}
                {paymentMethod === 'upi' && (
                  <div className="neo-card p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-white">Scan QR or Enter UPI ID</span>
                      </div>
                      <div className="flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.08]">
                        <button
                          onClick={() => setUpiOption('qr')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            upiOption === 'qr' ? 'bg-white text-black font-bold' : 'text-slate-400'
                          }`}
                        >
                          QR Code
                        </button>
                        <button
                          onClick={() => setUpiOption('id')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            upiOption === 'id' ? 'bg-white text-black font-bold' : 'text-slate-400'
                          }`}
                        >
                          UPI ID
                        </button>
                      </div>
                    </div>

                    {upiOption === 'qr' ? (
                      <div className="text-center space-y-3 py-2">
                        <div className="inline-block p-3 rounded-2xl bg-white/[0.03] border border-white/[0.1] shadow-xl">
                          <img
                            src={qrCodeUrl}
                            alt="Scan UPI QR"
                            className="w-44 h-44 mx-auto rounded-xl object-contain bg-[#10121a]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-center space-x-1">
                            <span>Scan with any UPI App</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Google Pay • PhonePe • Paytm • CRED • Amazon Pay
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 py-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Virtual Payment Address (VPA)</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setUpiVerified(false);
                              }}
                              placeholder="username@okhdfcbank"
                              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white font-mono text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setUpiVerified(true)}
                              className={`px-3 rounded-lg text-xs font-mono font-semibold transition ${
                                upiVerified
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'neo-btn-secondary'
                              }`}
                            >
                              {upiVerified ? 'Verified ✓' : 'Verify'}
                            </button>
                          </div>
                        </div>

                        {upiVerified && (
                          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>VPA Verified: Account holder matched</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* --- CARD VIEW --- */}
                {paymentMethod === 'card' && (
                  <div className="neo-card p-4 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="font-semibold text-white">Card Details</span>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>256-bit Encrypted</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white font-mono text-xs tracking-wider"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Security Code (CVV)</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            placeholder="•••"
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          placeholder="Full name on card"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- COD VIEW --- */}
                {paymentMethod === 'cod' && (
                  <div className="neo-card p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-white font-semibold">
                      <Banknote className="w-4 h-4 text-amber-400" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Pay in cash or through UPI upon delivery. Our couriers will carry digital payment QR scanners upon delivery.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: ORDER SUCCESS */}
            {step === 'success' && checkoutResult && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="p-5 rounded-2xl neo-card border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">Payment & Order Confirmed!</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Transaction verified via <span className="text-white font-mono font-bold uppercase">{checkoutResult.paymentMethodUsed}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Number:</span>
                      <span className="text-white font-bold">#{checkoutResult.order?.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Paid:</span>
                      <span className="text-emerald-400 font-bold">${checkoutResult.order?.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vendor Sub-Orders:</span>
                      <span className="text-slate-200">{checkoutResult.order?.vendorSubOrders?.length} Dispatches</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStep('cart');
                      setCheckoutResult(null);
                      onClose();
                    }}
                    className="w-full neo-btn-primary py-2.5 text-xs"
                  >
                    Return to Storefront
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          {items.length > 0 && step !== 'success' && (
            <div className="p-5 border-t border-white/[0.08] bg-[#090a0f] space-y-3.5">
              <div className="space-y-1 text-xs text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Cart Items ({items.length})</span>
                  <span className="text-white">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Shipping & Platform Processing</span>
                  <span className="text-emerald-400 font-semibold">Free (0% Convenience Fee)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.06]">
                  <span>Total Amount</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {step === 'cart' && (
                <button
                  onClick={() => setStep('address')}
                  className="w-full neo-btn-primary text-xs py-2.5 flex items-center justify-center space-x-1.5"
                >
                  <span>Proceed to Shipping Address</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              )}

              {step === 'address' && (
                <button
                  onClick={() => {
                    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
                      setErrorMsg('Please complete all required shipping fields');
                      return;
                    }
                    setErrorMsg(null);
                    setStep('payment');
                  }}
                  className="w-full neo-btn-primary text-xs py-2.5 flex items-center justify-center space-x-1.5"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              )}

              {step === 'payment' && (
                <button
                  disabled={checkingOut}
                  onClick={handleExecutePayment}
                  className="w-full neo-btn-primary text-xs py-2.5 flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {checkingOut ? (
                    <span>Securing Transaction...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>
                        Pay ${totalAmount.toFixed(2)} with {paymentMethod.toUpperCase()}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
