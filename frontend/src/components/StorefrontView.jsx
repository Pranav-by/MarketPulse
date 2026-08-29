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
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Toast notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161924] text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 border border-white/[0.1] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">Added <span className="font-semibold text-white">"{addedToast}"</span> to cart</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="neo-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Discover <span className="font-editorial italic font-normal text-slate-300">Verified Merchants</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
            Shop across independent creator studios and robotics merchants in one unified multi-vendor checkout with direct manufacturer guarantees.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06] whitespace-nowrap self-start">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Oversell Guarantee</span>
        </div>
      </div>

      {/* Search & Multi-Facet Filters */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, keywords, descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-white/[0.2] transition"
            />
          </div>

          {/* Sort & Quick Filter */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="createdAt" className="bg-[#10121a]">Newest Listings</option>
                <option value="price" className="bg-[#10121a]">Price: Low to High</option>
                <option value="rating" className="bg-[#10121a]">Highest Rated</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 cursor-pointer hover:bg-white/[0.05] transition whitespace-nowrap">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded bg-white/[0.05] border-white/[0.12] text-indigo-500 focus:ring-0 w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills & Price Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    isActive
                      ? 'bg-white text-[#090a0f] font-bold shadow-xs'
                      : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono self-end sm:self-auto">
            <span>Max: ${maxPrice}</span>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="neo-card p-5 h-72 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 neo-card space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, price limit, or category filter to discover available catalog items.
          </p>
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
                {/* Image & Wishlist Toggle */}
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
                    title={inWish ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
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
                      className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/[0.1] text-[10px] text-slate-300 hover:text-white flex items-center space-x-1 transition"
                    >
                      <Store className="w-3 h-3 text-indigo-400" />
                      <span>{product.store.name}</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>{product.category}</span>
                      <div className="flex items-center space-x-1 text-slate-300">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-slate-500 text-[10px]">({product.numReviews || 0})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-white transition">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Add button */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1.5 font-mono">
                        <span className="text-base font-black text-white">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                          <span className="text-[11px] text-slate-500 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Stock: <span className={product.stock > 0 ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                          {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={product.stock === 0}
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                        product.stock > 0
                          ? 'neo-btn-secondary'
                          : 'bg-white/[0.02] text-slate-600 border border-white/[0.04] cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
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
  );
};
