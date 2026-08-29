import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Plus, Package, AlertCircle } from 'lucide-react';

export const CreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    compareAtPrice: '',
    stock: '',
    description: '',
    tags: '',
    images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.createProduct({
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        images: [formData.images],
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      });

      if (res.success) {
        onProductCreated(res.product);
        onClose();
      } else {
        setError(res.message || 'Failed to create product');
      }
    } catch (err) {
      setError(err.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0d0f17] border border-white/[0.1] rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Add New Product</h2>
              <p className="text-[10px] text-slate-400">List an item in your store catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg neo-card border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[10px] uppercase">Product Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Ergonomic Mechanical Keyboard"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white focus:border-white/[0.2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#10121a] border border-white/[0.08] text-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Workspace">Workspace</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase">Available Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="25"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase">Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="49.99"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase">Compare Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="69.99"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-slate-400 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[10px] uppercase">Image URL *</label>
            <input
              type="url"
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[10px] uppercase">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide product details, materials, warranty, and technical specs..."
              className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={loading}
              className="w-full neo-btn-primary text-xs py-2 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? 'Publishing Product...' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
