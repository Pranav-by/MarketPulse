import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Store,
  Star,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Package,
  Heart,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const VendorStoreView = ({ storeSlug, onBack, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const res = await api.getStore(storeSlug);
        if (res.success) {
          setStoreData(res);
        }
      } catch (err) {
        console.error('Fetch store failed:', err);
      } finally {
        setLoading(false);
      }
    };
    if (storeSlug) fetchStore();
  }, [storeSlug]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        <div className="neo-card p-8 h-48 animate-pulse bg-white/[0.02]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="neo-card p-4 h-64 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      </div>
    );
  }

  if (!storeData?.store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Store className="w-10 h-10 text-slate-500 mx-auto" />
        <h2 className="text-base font-bold text-white">Store Not Found</h2>
        <button onClick={onBack} className="neo-btn-primary text-xs">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const { store, products, productsCount } = storeData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161924] text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 border border-white/[0.1] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">Added <span className="font-semibold text-white">"{addedToast}"</span> to cart</span>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="neo-btn-secondary text-xs flex items-center space-x-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Stores</span>
      </button>

      {/* Store Banner & Bio */}
      <div className="neo-card p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white flex-shrink-0">
              <Store className="w-8 h-8 text-indigo-400" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{store.name}</h1>
                <span className="neo-badge neo-badge-emerald">Verified Merchant</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                {store.description || 'Authorized specialty merchant providing direct warranty and expedited fulfillment.'}
              </p>
              <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono pt-1">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{store.rating || 4.9}</span>
                  <span className="text-slate-500">(Store Rating)</span>
                </div>
                <span>•</span>
                <span>{productsCount} Active Products</span>
                <span>•</span>
                <span>Owner: {store.owner?.name}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center space-x-3 self-start sm:self-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <div className="font-semibold text-white">Direct Merchant Warranty</div>
              <div className="text-[10px] text-slate-400">Orders split & fulfilled directly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Store Catalog</h2>
            <p className="text-xs text-slate-400">Items exclusively sold by {store.name}</p>
          </div>
          <span className="text-xs font-mono text-slate-500">{products.length} Items</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 neo-card space-y-2">
            <Package className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No active products listed by this store yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const inWish = isInWishlist(product._id);
              return (
                <div
                  key={product._id}
                  onClick={() => onSelectProduct(product)}
                  className="neo-card-interactive overflow-hidden cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full bg-[#0a0c12] overflow-hidden border-b border-white/[0.06]">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300 opacity-90 group-hover:opacity-100"
                    />

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition ${
                        inWish
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-black/60 text-slate-400 hover:text-white border border-white/[0.1]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>{product.category}</span>
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-white transition">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-white font-mono">${product.price.toFixed(2)}</span>
                        <div className="text-[10px] font-mono text-slate-500">
                          Stock: <span className={product.stock > 0 ? 'text-slate-300' : 'text-rose-400'}>{product.stock} units</span>
                        </div>
                      </div>

                      <button
                        disabled={product.stock === 0}
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                          product.stock > 0
                            ? 'neo-btn-secondary'
                            : 'bg-white/[0.02] text-slate-600 border border-white/[0.04] cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
