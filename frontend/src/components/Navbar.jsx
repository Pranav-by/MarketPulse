import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  ShoppingBag,
  Store,
  BarChart3,
  Zap,
  ChevronDown,
  Layers,
  FileCode,
  LogOut,
  User,
  Heart,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab, onOpenCart, onOpenApiDocs }) => {
  const { user, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'store', label: 'Storefront', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { id: 'orders', label: 'My Orders', icon: Layers },
    ...(user?.role === 'vendor' ? [{ id: 'vendor', label: 'Vendor Portal', icon: Store }] : []),
    ...(user?.role === 'admin' ? [
      { id: 'vendor', label: 'Vendor Portal', icon: Store },
      { id: 'admin', label: 'Admin Hub', icon: BarChart3 },
      { id: 'concurrency', label: 'Concurrency Lab', icon: Zap },
    ] : []),
  ];

  const getRoleBadgeClass = () => {
    if (user?.role === 'admin') return 'neo-badge-amber';
    if (user?.role === 'vendor') return 'neo-badge-emerald';
    return 'neo-badge-indigo';
  };

  const getRoleLabel = () => {
    if (user?.role === 'admin') return 'Admin';
    if (user?.role === 'vendor') return 'Vendor';
    return 'Customer';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('store')}>
          <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white font-mono font-bold text-xs">
            MP
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:block">MarketPulse</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Wishlist quick button */}
          <button
            onClick={() => setCurrentTab('wishlist')}
            className={`relative p-2 rounded-lg text-slate-300 border transition ${
              currentTab === 'wishlist'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08]'
            }`}
            title="My Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono font-black flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart (customers) */}
          {user?.role === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[#090a0f] text-[10px] font-mono font-black flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>
          )}

          {/* API Docs (admin only) */}
          {user?.role === 'admin' && (
            <button
              onClick={onOpenApiDocs}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>API</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-white/[0.1] flex items-center justify-center">
                  <User className="w-3 h-3 text-slate-300" />
                </div>
              )}
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px] hidden sm:block">
                {user?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#10121a] border border-white/[0.1] rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in">
                {/* User info */}
                <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{user?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{user?.email}</div>
                    </div>
                    <span className={`neo-badge ${getRoleBadgeClass()}`}>{getRoleLabel()}</span>
                  </div>
                  {user?.store && (
                    <div className="mt-1.5 text-[10px] text-slate-500 flex items-center gap-1.5">
                      <Store className="w-3 h-3" />
                      <span>{user.store.name}</span>
                    </div>
                  )}
                </div>

                {/* Wishlist Link */}
                <button
                  onClick={() => {
                    setCurrentTab('wishlist');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.04] transition flex items-center space-x-2 text-xs text-slate-300"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>My Wishlist ({wishlistCount})</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 transition flex items-center space-x-2 text-xs text-rose-400 border-t border-white/[0.04] mt-1 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="font-semibold">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-2 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
