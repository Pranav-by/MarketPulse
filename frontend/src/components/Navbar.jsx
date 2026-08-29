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
  Sparkles,
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
    { id: 'store', label: 'Storefront', icon: ShoppingBag, color: 'bg-[#FEF08A]' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount, color: 'bg-[#FF6B97]' },
    { id: 'orders', label: 'My Orders', icon: Layers, color: 'bg-[#C4B5FD]' },
    ...(user?.role === 'vendor' ? [{ id: 'vendor', label: 'Vendor Portal', icon: Store, color: 'bg-[#6EE7B7]' }] : []),
    ...(user?.role === 'admin' ? [
      { id: 'vendor', label: 'Vendor Portal', icon: Store, color: 'bg-[#6EE7B7]' },
      { id: 'admin', label: 'Admin Hub', icon: BarChart3, color: 'bg-[#FEF08A]' },
      { id: 'concurrency', label: 'Concurrency Lab', icon: Zap, color: 'bg-[#FF6B97]' },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b-3 border-black shadow-brutal mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setCurrentTab('store')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FEF08A] border-2.5 border-black shadow-brutal-sm flex items-center justify-center text-black font-display font-black text-sm group-hover:rotate-6 transition">
            MP
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-display font-black tracking-tight text-black">
              MarketPulse
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#6EE7B7] border-2 border-black text-[10px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000] hidden sm:inline-flex">
              Neubrutal
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold flex items-center space-x-1.5 transition border-2 border-black ${
                  isActive
                    ? `${item.color} shadow-brutal translate-x-[-1px] translate-y-[-1px]`
                    : 'bg-white hover:bg-slate-100 shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px]'
                }`}
              >
                <Icon className="w-4 h-4 text-black" />
                <span className="text-black">{item.label}</span>
                {item.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-black text-white text-[10px] font-mono font-black">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Wishlist quick button */}
          <button
            onClick={() => setCurrentTab('wishlist')}
            className={`relative p-2 rounded-xl border-2 border-black transition ${
              currentTab === 'wishlist'
                ? 'bg-[#FF6B97] shadow-brutal'
                : 'bg-white shadow-brutal-sm hover:bg-[#FBCFE8]'
            }`}
            title="My Wishlist"
          >
            <Heart className="w-4 h-4 text-black" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono font-black flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart (customers) */}
          {user?.role === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-[#FEF08A] border-2 border-black shadow-brutal-sm hover:bg-[#FDE047] transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono font-black flex items-center justify-center border border-white">
                  {totalItemCount}
                </span>
              )}
            </button>
          )}

          {/* API Docs (admin only) */}
          {user?.role === 'admin' && (
            <button
              onClick={onOpenApiDocs}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold bg-[#67E8F9] border-2 border-black shadow-brutal-sm hover:bg-[#38BDF8] transition"
            >
              <FileCode className="w-4 h-4 text-black" />
              <span>API</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white border-2 border-black shadow-brutal-sm text-black"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border-2 border-black shadow-brutal-sm hover:bg-slate-50 transition"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-black" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#FEF08A] border border-black flex items-center justify-center">
                  <User className="w-3 h-3 text-black" />
                </div>
              )}
              <span className="text-xs font-display font-bold text-black truncate max-w-[90px] hidden sm:block">
                {user?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-black" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-3 border-black rounded-2xl shadow-brutal-lg p-2 z-50 animate-pop-in">
                {/* User info */}
                <div className="p-3 bg-[#FEF08A] border-2 border-black rounded-xl mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-display font-black text-black">{user?.name}</div>
                      <div className="text-[10px] text-black font-mono font-bold truncate">{user?.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-mono font-black uppercase">
                      {user?.role}
                    </span>
                  </div>
                  {user?.store && (
                    <div className="mt-1.5 text-[10px] text-black font-bold flex items-center gap-1.5">
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
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F3F4F6] transition flex items-center space-x-2 text-xs font-bold text-black"
                >
                  <Heart className="w-4 h-4 text-[#FF6B97]" />
                  <span>My Wishlist ({wishlistCount})</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[#FF6B97]/20 hover:bg-[#FF6B97] hover:text-white border-2 border-black transition flex items-center space-x-2 text-xs font-bold text-black mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 py-3 space-y-2 animate-pop-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-display font-bold flex items-center justify-between border-2 border-black ${
                  isActive ? `${item.color} shadow-brutal-sm` : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-black" />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold">
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
