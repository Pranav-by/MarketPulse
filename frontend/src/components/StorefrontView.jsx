import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
  Shield,
  Heart,
  Store,
  ArrowUpDown,
  Sparkles,
  Zap,
} from 'lucide-react';

export const StorefrontView = ({ onSelectProduct, onOpenStore }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('createdAt');
  const [addedToast, setAddedToast] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (inStockOnly) params.inStock = 'true';
      if (maxPrice < 500) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const data = await api.getProducts(params);
      if (data.success) {
        setProducts(data.products || []);
        if (data.categories) setCategories(['All', ...data.categories]);
      }
    } catch (err) {
      console.error('Fetch products failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, inStockOnly, maxPrice, sortBy]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pop-in">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FEF08A] text-black font-display font-bold px-5 py-3 rounded-2xl shadow-brutal-xl flex items-center space-x-2.5 border-3 border-black animate-pop-in">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span className="text-xs">Added <span className="underline">"{addedToast}"</span> to cart!</span>
        </div>
      )}

      {/* Neubrutalist Hero Card */}
      <div className="bg-[#FEF08A] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-[#FEF08A] fill-current" />
            <span>DIRECT MULTI-VENDOR MARKETPLACE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-black tracking-tight leading-tight">
            DISCOVER INDEPENDENT <br className="hidden sm:block" />
            <span className="bg-[#FF6B97] text-white px-2 py-0.5 rounded-lg border-2 border-black shadow-brutal-sm inline-block rotate-[-1deg]">
              CREATOR STUDIOS
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-xl leading-relaxed">
            Shop hardware, studio audio, and artisanal robotics in one single unified checkout. Sub-orders are automatically partitioned and fulfilled directly by verified merchants.
          </p>
        </div>

        <div className="flex flex-col gap-3 self-start md:self-auto z-10">
          <div className="px-4 py-2.5 rounded-2xl bg-white border-2.5 border-black shadow-brutal text-xs font-mono font-bold flex items-center space-x-2">
            <Shield className="w-4 h-4 text-black" />
            <span>Zero-Oversell Guarantee</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#6EE7B7] border-2.5 border-black shadow-brutal text-xs font-mono font-bold flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span>Instant Free UPI & 0% Fees</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-brutal-lg space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog, keyboards, gear, materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border-2 border-black text-xs font-bold text-black placeholder-slate-400 focus:bg-[#FEFCE8] focus:outline-none"
            />
          </div>

          {/* Sort & In-Stock */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1.5 bg-[#F9FAFB] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-black" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-black text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="createdAt">Newest Listings</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#6EE7B7] border-2 border-black text-xs font-bold text-black cursor-pointer shadow-brutal-sm hover:translate-x-[-1px] transition">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-black w-4 h-4"
              />
              <span>In Stock</span>
            </label>
          </div>
        </div>

        {/* Categories & Price Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t-2 border-black">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat, i) => {
              const isActive = selectedCategory === cat;
              const colors = ['bg-[#FEF08A]', 'bg-[#FF6B97]', 'bg-[#6EE7B7]', 'bg-[#C4B5FD]', 'bg-[#67E8F9]'];
              const pillColor = colors[i % colors.length];

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-black whitespace-nowrap transition border-2 border-black ${
                    isActive
                      ? `${pillColor} shadow-brutal translate-x-[-1px] translate-y-[-1px]`
                      : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-black self-end sm:self-auto bg-[#F3F4F6] px-3 py-1.5 rounded-xl border-2 border-black">
            <span>Max: ${maxPrice}</span>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-black cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border-3 border-black rounded-2xl p-5 h-72 animate-pulse shadow-brutal" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border-3 border-black rounded-3xl p-8 shadow-brutal space-y-3">
          <AlertCircle className="w-10 h-10 text-black mx-auto" />
          <h3 className="text-base font-display font-black text-black">No Products Matched</h3>
          <p className="text-xs font-bold text-black/70 max-w-sm mx-auto">
            Try adjusting your search query, price limit, or category filter to discover available catalog items.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const inWish = isInWishlist(product._id);

            return (
              <div
                key={product._id}
                onClick={() => onSelectProduct(product)}
                className="bg-white border-3 border-black rounded-2xl shadow-brutal hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition duration-150 cursor-pointer flex flex-col justify-between overflow-hidden group"
              >
                {/* Product Image & Badges */}
                <div className="relative h-52 w-full bg-[#F3F4F6] overflow-hidden border-b-3 border-black">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-xl border-2 border-black transition shadow-brutal-sm ${
                      inWish
                        ? 'bg-[#FF6B97] text-white'
                        : 'bg-white text-black hover:bg-[#FF6B97] hover:text-white'
                    }`}
                    title={inWish ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                  </button>

                  {/* Vendor Store Tag */}
                  {product.store && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenStore && product.store.slug) {
                          onOpenStore(product.store.slug);
                        }
                      }}
                      className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-white border-2 border-black text-[10px] font-display font-black text-black hover:bg-[#FEF08A] flex items-center space-x-1 transition shadow-brutal-sm"
                    >
                      <Store className="w-3.5 h-3.5 text-black" />
                      <span>{product.store.name}</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-black mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-[#C4B5FD] border border-black uppercase tracking-wider">{product.category}</span>
                      <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#FEF08A] border border-black">
                        <Star className="w-3 h-3 text-black fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-[10px] opacity-70">({product.numReviews || 0})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-display font-black text-black line-clamp-1 mt-2">
                      {product.title}
                    </h3>
                    <p className="text-xs font-semibold text-black/70 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1.5 font-mono">
                        <span className="text-lg font-black text-black">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-black/50 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono font-bold">
                        Stock: <span className={product.stock > 0 ? 'text-black' : 'text-rose-600'}>
                          {product.stock > 0 ? `${product.stock} units` : 'Sold Out'}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={product.stock === 0}
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`px-4 py-2 rounded-xl text-xs font-display font-black border-2 border-black transition ${
                        product.stock > 0
                          ? 'bg-[#FEF08A] hover:bg-[#FDE047] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] text-black'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
