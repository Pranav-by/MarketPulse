import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { StorefrontView } from './components/StorefrontView';
import { WishlistView } from './components/WishlistView';
import { VendorStoreView } from './components/VendorStoreView';
import { VendorPortalView } from './components/VendorPortalView';
import { AdminHubView } from './components/AdminHubView';
import { ConcurrencyLabView } from './components/ConcurrencyLabView';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { Layers } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
    <div className="text-center space-y-3 animate-fade-in">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1]">
        <Layers className="w-6 h-6 text-white animate-pulse" />
      </div>
      <p className="text-xs font-mono text-slate-500">Loading MarketPulse...</p>
    </div>
  </div>
);

const MainApp = () => {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('store');
  const [selectedStoreSlug, setSelectedStoreSlug] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Not logged in — show login / register page
  if (!user) {
    return <AuthPage />;
  }

  const handleOpenStore = (slug) => {
    setSelectedStoreSlug(slug);
    setCurrentTab('store-detail');
  };

  // Authenticated — show the full app
  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'store' && (
          <StorefrontView
            onSelectProduct={(product) => setSelectedProduct(product)}
            onOpenStore={handleOpenStore}
          />
        )}
        {currentTab === 'wishlist' && (
          <WishlistView
            onGoToStore={() => setCurrentTab('store')}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}
        {currentTab === 'store-detail' && (
          <VendorStoreView
            storeSlug={selectedStoreSlug}
            onBack={() => setCurrentTab('store')}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}
        {currentTab === 'orders' && <OrdersHistoryView onGoToStore={() => setCurrentTab('store')} />}
        {currentTab === 'vendor' && <VendorPortalView />}
        {currentTab === 'admin' && <AdminHubView />}
        {currentTab === 'concurrency' && <ConcurrencyLabView />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderCompleted={(order) => {}}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenStore={handleOpenStore}
      />

      {/* API Specs & Postman Modal */}
      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-white/[0.06] bg-[#090a0f] py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">MarketPulse</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Multi-Vendor Marketplace Engine</span>
          </div>

          <div className="flex items-center space-x-4 text-[10px]">
            <span className="hover:text-slate-300 cursor-pointer transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer transition">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer transition">Merchant Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
