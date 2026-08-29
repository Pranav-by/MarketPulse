import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Plus,
  Star,
  Store,
  ArrowRight,
} from 'lucide-react';

export const WishlistView = ({ onGoToStore, onSelectProduct }) => {
  const { wishlistProducts, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="neo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="neo-badge neo-badge-rose">Saved Items</span>
            <span className="text-[10px] font-mono text-slate-500">{wishlistProducts.length} Products</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">My Wishlist</h1>
          <p className="text-xs text-slate-400">
            Products saved for later across multiple verified stores
          </p>
        </div>

        <button
          onClick={onGoToStore}
          className="neo-btn-secondary text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="neo-card p-5 h-64 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="text-center py-16 neo-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any product in the catalog to save it for later.
          </p>
          <button
            onClick={onGoToStore}
            className="neo-btn-primary text-xs inline-flex items-center space-x-1.5"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => onSelectProduct(product)}
              className="neo-card-interactive overflow-hidden cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full bg-[#0a0c12] overflow-hidden border-b border-white/[0.06]">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-300 opacity-90 group-hover:opacity-100"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition"
                  title="Remove from wishlist"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
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
                    <span className="text-base font-black text-white font-mono">${product.price?.toFixed(2)}</span>
                    <div className="text-[10px] font-mono text-slate-500">
                      Stock: <span className={product.stock > 0 ? 'text-slate-300' : 'text-rose-400'}>{product.stock} units</span>
                    </div>
                  </div>

                  <button
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToCart(product);
                    }}
                    className="neo-btn-primary text-xs flex items-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
