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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0d0f17] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-lg bg-black/60 text-slate-400 hover:text-white border border-white/[0.1] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-white/[0.06] bg-[#090a0f] px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'details'
                ? 'text-white border-white'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 transition border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'reviews'
                ? 'text-white border-white'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>Verified Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto flex-1">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Product Image */}
              <div className="relative h-64 sm:h-full bg-black/50 border-r border-white/[0.06] flex items-center justify-center p-4">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="max-h-72 w-full object-contain rounded-lg"
                />
              </div>

              {/* Product Details & Purchase Form */}
              <div className="p-6 space-y-4 flex flex-col justify-between text-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] uppercase tracking-wider">{product.category}</span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center space-x-1 text-slate-300 hover:underline"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span className="font-bold">{product.rating}</span>
                      <span className="text-slate-500">({reviews.length} reviews)</span>
                    </button>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{product.title}</h2>
                  <p className="text-slate-400 leading-relaxed text-xs">{product.description}</p>

                  {/* Vendor Attribution */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <Store className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-300">
                        Sold by{' '}
                        <button
                          onClick={() => {
                            if (onOpenStore && product.store?.slug) {
                              onOpenStore(product.store.slug);
                              onClose();
                            }
                          }}
                          className="font-bold text-white hover:underline"
                        >
                          {product.store?.name || 'Verified Store'}
                        </button>
                      </span>
                    </div>
                    <span className="neo-badge neo-badge-emerald text-[9px]">Direct Merchant</span>
                  </div>

                  {/* Guarantees */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Free Express Delivery</span>
                    </div>
                    <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>Easy Cancellation</span>
                    </div>
                  </div>
                </div>

                {/* Price, Quantity & Add to Cart */}
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-baseline justify-between font-mono">
                    <div>
                      <span className="text-xl font-black text-white">${(product.price * quantity).toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-slate-500 line-through ml-2">
                          ${(product.compareAtPrice * quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Stock: <span className={product.stock > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{product.stock} units left</span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Add Button */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-0.5">
                      <button
                        disabled={quantity <= 1}
                        onClick={() => handleQtyChange(quantity - 1)}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono font-bold text-white text-xs">{quantity}</span>
                      <button
                        disabled={quantity >= product.stock}
                        onClick={() => handleQtyChange(quantity + 1)}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      disabled={product.stock === 0 || added}
                      onClick={handleAdd}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
                        added
                          ? 'bg-emerald-500 text-white'
                          : product.stock > 0
                          ? 'neo-btn-primary'
                          : 'bg-white/[0.03] text-slate-600 border border-white/[0.05] cursor-not-allowed'
                      }`}
                    >
                      {added ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add {quantity > 1 ? `(${quantity})` : ''} to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- REVIEWS TAB --- */
            <div className="p-6 space-y-6 text-xs animate-fade-in">
              {/* Rating Summary */}
              <div className="neo-card p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black font-mono text-white">{product.rating}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(product.rating) ? 'fill-current text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Based on {reviews.length} customer ratings</div>
                </div>

                <div className="text-right">
                  <span className="neo-badge neo-badge-emerald">100% Verified Purchases</span>
                </div>
              </div>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="neo-card p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h3 className="font-bold text-white flex items-center space-x-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Write a Customer Review</span>
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-0.5 text-amber-400 hover:scale-110 transition"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {reviewSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Your review has been published!</span>
                    </div>
                  )}

                  {reviewError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center space-x-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    required
                    placeholder="Share your experience regarding build quality, packaging, and delivery..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-xs"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="neo-btn-primary text-xs flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              ) : (
                <div className="neo-card p-4 text-center text-slate-400 text-xs">
                  Please sign in to write a review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                <h3 className="font-bold text-white font-mono text-xs uppercase tracking-wider">Customer Feedback</h3>
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-xs py-4 text-center">Be the first customer to review this item!</p>
                ) : (
                  reviews.map((rev, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-300 font-bold text-[10px]">
                            {rev.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-xs">{rev.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-slate-600'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed text-xs">{rev.comment}</p>
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
