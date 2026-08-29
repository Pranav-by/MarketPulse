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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pop-in">
      {/* Header */}
      <div className="bg-[#FF6B97] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div>
          <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 fill-current text-[#FF6B97]" />
            <span>SAVED FAVORITES ({wishlistProducts.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm font-bold text-white/90 mt-1">
            Products saved for later across multiple verified creator stores
          </p>
        </div>

        <button
          onClick={onGoToStore}
          className="px-4 py-2.5 rounded-xl bg-white border-2 border-black text-black font-display font-black text-xs shadow-brutal flex items-center space-x-1.5 self-start sm:self-auto hover:bg-[#FEF08A] transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-3 border-black rounded-2xl p-5 h-64 animate-pulse shadow-brutal" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border-3 border-black rounded-3xl p-8 shadow-brutal space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6B97] border-2.5 border-black shadow-brutal flex items-center justify-center mx-auto text-white">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <h3 className="text-base font-display font-black text-black">Your wishlist is empty</h3>
          <p className="text-xs font-bold text-black/70 max-w-sm mx-auto">
            Click the heart icon on any product in the catalog to save it for later.
          </p>
          <button
            onClick={onGoToStore}
            className="neo-btn-primary text-xs inline-flex items-center space-x-1.5 mt-2"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => onSelectProduct(product)}
              className="bg-white border-3 border-black rounded-2xl shadow-brutal hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition duration-150 cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              <div className="relative h-48 w-full bg-[#F3F4F6] overflow-hidden border-b-3 border-black">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-[#FF6B97] text-white border-2 border-black shadow-brutal-sm hover:scale-110 transition"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-black mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#C4B5FD] border border-black uppercase tracking-wider">{product.category}</span>
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#FEF08A] border border-black">
                      <Star className="w-3 h-3 text-black fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-display font-black text-black line-clamp-1 mt-2">
                    {product.title}
                  </h3>
                  <p className="text-xs font-semibold text-black/70 line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-black font-mono">${product.price?.toFixed(2)}</span>
                    <div className="text-[10px] font-mono font-bold text-black/70">
                      Stock: <span className={product.stock > 0 ? 'text-black font-black' : 'text-rose-600 font-black'}>{product.stock} units</span>
                    </div>
                  </div>

                  <button
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToCart(product);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#6EE7B7] hover:bg-[#34D399] text-black font-display font-black text-xs border-2 border-black shadow-brutal-sm flex items-center space-x-1.5 transition"
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
