import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  X,
  Star,
  Store,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  Send,
  User,
  AlertCircle,
} from 'lucide-react';

export const ProductDetailModal = ({ product: initialProduct, onClose, onOpenStore }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (initialProduct?._id) {
      api.getProductById(initialProduct._id).then((res) => {
        if (res.success && res.product) {
          setProduct(res.product);
        }
      });
    }
  }, [initialProduct]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const handleQtyChange = (newQty) => {
    if (newQty >= 1 && newQty <= (product.stock || 1)) {
      setQuantity(newQty);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    setReviewError(null);
    try {
      const res = await api.createProductReview(product._id, {
        rating: newRating,
        comment: newComment,
      });

      if (res.success) {
        setProduct(res.product);
        setNewComment('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 3000);
      } else {
        setReviewError(res.message || 'Failed to submit review');
      }
    } catch (err) {
      setReviewError(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const reviews = product.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-pop-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border-3 border-black rounded-3xl shadow-brutal-xl overflow-hidden max-h-[90vh] flex flex-col z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white border-2 border-black text-black hover:bg-[#FF6B97] hover:text-white transition shadow-brutal-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b-3 border-black bg-[#FEF08A] px-6 pt-4 gap-3 text-xs font-display font-black">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-4 rounded-t-xl transition border-2 border-b-0 border-black ${
              activeTab === 'details'
                ? 'bg-white text-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black'
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 px-4 rounded-t-xl transition border-2 border-b-0 border-black flex items-center space-x-1.5 ${
              activeTab === 'reviews'
                ? 'bg-white text-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black'
            }`}
          >
            <span>Verified Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto flex-1 p-6 bg-white">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="relative h-64 sm:h-full bg-[#F3F4F6] border-2.5 border-black rounded-2xl flex items-center justify-center p-4 shadow-brutal-sm overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="max-h-64 w-full object-contain"
                />
              </div>

              {/* Product Details & Purchase Form */}
              <div className="space-y-4 flex flex-col justify-between text-xs font-bold text-black">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-black font-mono text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#C4B5FD] border-2 border-black font-black uppercase tracking-wider">
                      {product.category}
                    </span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-[#FEF08A] border border-black hover:underline"
                    >
                      <Star className="w-3.5 h-3.5 text-black fill-current" />
                      <span className="font-black">{product.rating}</span>
                      <span className="opacity-70">({reviews.length} reviews)</span>
                    </button>
                  </div>

                  <h2 className="text-lg sm:text-xl font-display font-black text-black leading-snug">
                    {product.title}
                  </h2>
                  <p className="text-black/70 font-semibold leading-relaxed text-xs">
                    {product.description}
                  </p>

                  {/* Vendor Attribution */}
                  <div className="p-3 rounded-xl bg-[#EBF3FE] border-2 border-black flex items-center justify-between text-xs shadow-brutal-sm">
                    <div className="flex items-center space-x-2">
                      <Store className="w-4 h-4 text-black" />
                      <span>
                        Sold by{' '}
                        <button
                          onClick={() => {
                            if (onOpenStore && product.store?.slug) {
                              onOpenStore(product.store.slug);
                              onClose();
                            }
                          }}
                          className="font-black text-black underline"
                        >
                          {product.store?.name || 'Verified Store'}
                        </button>
                      </span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-[#6EE7B7] border border-black text-[9px] font-black uppercase">
                      Direct
                    </span>
                  </div>

                  {/* Guarantees */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-[#6EE7B7] border-2 border-black font-black">
                      <Truck className="w-3.5 h-3.5 text-black flex-shrink-0" />
                      <span>Free Express</span>
                    </div>
                    <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-[#FEF08A] border-2 border-black font-black">
                      <RotateCcw className="w-3.5 h-3.5 text-black flex-shrink-0" />
                      <span>Easy Cancel</span>
                    </div>
                  </div>
                </div>

                {/* Price, Quantity & Add to Cart */}
                <div className="pt-3 border-t-2 border-black space-y-3">
                  <div className="flex items-baseline justify-between font-mono">
                    <div>
                      <span className="text-2xl font-black text-black font-mono">${(product.price * quantity).toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-black/50 line-through ml-2">
                          ${(product.compareAtPrice * quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono font-black">
                      Stock: <span className={product.stock > 0 ? 'text-black' : 'text-rose-600'}>{product.stock} units</span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Add Button */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex items-center bg-[#FEF08A] border-2 border-black rounded-xl shadow-brutal-sm">
                      <button
                        disabled={quantity <= 1}
                        onClick={() => handleQtyChange(quantity - 1)}
                        className="p-2 text-black hover:bg-[#FDE047] disabled:opacity-30 transition rounded-l-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono font-black text-black text-sm">{quantity}</span>
                      <button
                        disabled={quantity >= product.stock}
                        onClick={() => handleQtyChange(quantity + 1)}
                        className="p-2 text-black hover:bg-[#FDE047] disabled:opacity-30 transition rounded-r-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      disabled={product.stock === 0 || added}
                      onClick={handleAdd}
                      className={`flex-1 py-3 px-4 rounded-xl font-display font-black text-xs border-2.5 border-black transition ${
                        added
                          ? 'bg-[#6EE7B7] text-black shadow-brutal'
                          : product.stock > 0
                          ? 'bg-[#FEF08A] hover:bg-[#FDE047] text-black shadow-brutal hover:translate-x-[-1px] hover:translate-y-[-1px]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-400'
                      }`}
                    >
                      {added ? (
                        <div className="flex items-center justify-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-1.5">
                          <Plus className="w-4 h-4" />
                          <span>Add {quantity > 1 ? `(${quantity})` : ''} to Cart</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- REVIEWS TAB --- */
            <div className="space-y-6 text-xs font-bold text-black animate-pop-in">
              {/* Rating Summary */}
              <div className="bg-[#FEF08A] border-2.5 border-black rounded-2xl p-5 shadow-brutal flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black font-mono text-black">{product.rating}</span>
                    <span className="text-xs text-black/70 font-mono">/ 5.0</span>
                  </div>
                  <div className="flex items-center space-x-1 text-black my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(product.rating) ? 'fill-current text-black' : 'text-black/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-black/70">Based on {reviews.length} customer ratings</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-xl bg-white border-2 border-black text-xs font-black shadow-brutal-sm">
                    ★ 100% Verified
                  </span>
                </div>
              </div>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="bg-white border-2.5 border-black rounded-2xl p-5 shadow-brutal space-y-3.5">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <h3 className="font-display font-black text-black flex items-center space-x-1.5">
                      <MessageSquare className="w-4 h-4 text-black" />
                      <span>Write a Customer Review</span>
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-0.5 text-black hover:scale-125 transition"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {reviewSuccess && (
                    <div className="p-3 rounded-xl bg-[#6EE7B7] border-2 border-black text-black text-xs font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Your review has been published!</span>
                    </div>
                  )}

                  {reviewError && (
                    <div className="p-3 rounded-xl bg-[#FF6B97]/20 border-2 border-black text-black text-xs font-bold flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    required
                    placeholder="Share your experience regarding build quality, packaging, and delivery..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-black text-xs shadow-brutal-sm focus:bg-[#FEFCE8]"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2.5 rounded-xl bg-[#6EE7B7] hover:bg-[#34D399] text-black font-display font-black text-xs border-2 border-black shadow-brutal flex items-center space-x-1.5 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              ) : null}

              {/* Reviews List */}
              <div className="space-y-3">
                <h3 className="font-display font-black text-black text-xs uppercase tracking-wider">Customer Feedback</h3>
                {reviews.length === 0 ? (
                  <p className="text-black/60 text-xs py-4 text-center">Be the first customer to review this item!</p>
                ) : (
                  reviews.map((rev, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#F9FAFB] border-2 border-black shadow-brutal-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-xl bg-[#FEF08A] border-2 border-black flex items-center justify-center text-black font-black text-xs shadow-xs">
                            {rev.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-display font-black text-black text-xs">{rev.name}</div>
                            <div className="text-[10px] text-black/60 font-mono">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-0.5 text-black">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current text-black' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-black font-semibold leading-relaxed text-xs">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
