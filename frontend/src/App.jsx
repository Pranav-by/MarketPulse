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
import { Sparkles, Layers } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#5B85FA] brutal-grid-bg flex items-center justify-center p-4">
    <div className="neo-card p-8 text-center space-y-4 shadow-brutal-xl animate-pop-in">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEF08A] border-3 border-black shadow-brutal">
        <Sparkles className="w-7 h-7 text-black animate-spin" />
      </div>
      <h2 className="text-lg font-display font-black text-black">Loading MarketPulse...</h2>
      <p className="text-xs font-mono font-bold text-black/70">Neo-Brutalist Engine</p>
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleOpenStore = (slug) => {
    setSelectedStoreSlug(slug);
    setCurrentTab('store-detail');
  };

  return (
    <div className="min-h-screen bg-[#5B85FA] brutal-grid-bg text-black selection:bg-[#FEF08A] selection:text-black flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
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

      {/* API Specs Modal */}
      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t-3 border-black bg-[#FEF08A] py-6 px-4 sm:px-6 lg:px-8 text-xs text-black font-mono font-bold shadow-[0px_-4px_0px_0px_#000]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-display font-black text-sm uppercase bg-black text-white px-2 py-0.5 rounded-md">MarketPulse</span>
            <span>★</span>
            <span>Neo-Brutalist Multi-Vendor Architecture</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-black">
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Vendors</span>
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
