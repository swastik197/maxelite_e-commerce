"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SecurityIcon from '@mui/icons-material/Security'
import CachedIcon from '@mui/icons-material/Cached'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PercentIcon from '@mui/icons-material/Percent'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import StarIcon from '@mui/icons-material/Star'

import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'

const NAV_BG = '#001e3a'
const ACCENT = '#0f3c4c'

const CartContent = () => {
  const [cartItems, setCartItems] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [notification, setNotification] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const shuffled = [...productsData].sort(() => 0.5 - Math.random())
    const itemsWithQuantity = shuffled.slice(0, 4).map(product => ({
      ...product,
      quantity: Math.floor(Math.random() * 3) + 1,
      isWishlisted: Math.random() > 0.5
    }))
    setCartItems(itemsWithQuantity)
  }, [])

  const getCategoryName = (categoryId) => {
    const category = categoriesData.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown'
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
    showNotification('Item removed from cart')
  }

  const toggleWishlist = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, isWishlisted: !item.isWishlisted } : item
      )
    )
    const item = cartItems.find(i => i.id === productId)
    showNotification(item?.isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([])
      showNotification('Cart cleared')
    }
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME20') {
      setPromoApplied(true)
      showNotification('Promo code applied successfully!')
    } else {
      showNotification('Invalid promo code', 'error')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + Math.round(item.price * 1.25) * item.quantity, 0)
  const savings = originalTotal - subtotal
  const promoDiscount = promoApplied ? subtotal * 0.2 : 0
  const shipping = subtotal > 500 ? 0 : 25
  const tax = (subtotal - promoDiscount) * 0.08
  const total = subtotal - promoDiscount + shipping + tax

  return (
    <div className="min-h-screen bg-white">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition-all duration-300 ${
          notification.type === 'success' ? 'bg-[#001e3a]' : 'bg-red-600'
        } text-white`}>
          <CheckCircleIcon className="w-5 h-5" />
          {notification.message}
        </div>
      )}

      {/* Hero Header – matches landing page style */}
      <div
        className="relative w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAV_BG} 0%, ${ACCENT} 100%)`, minHeight: '220px' }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white/20 rounded-full animate-[floatParticle_8s_ease-in-out_infinite]" />
          <div className="absolute top-[60%] left-[80%] w-3 h-3 bg-blue-300/15 rounded-full animate-[floatParticle_10s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[40%] left-[50%] w-1.5 h-1.5 bg-white/20 rounded-full animate-[floatParticle_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[75%] left-[30%] w-2.5 h-2.5 bg-white/10 rounded-full animate-[floatParticle_12s_ease-in-out_infinite_0.5s]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">Your Selection</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-1">Shopping</h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white">Cart</h1>
            <p className="text-white/50 mt-3 text-sm">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected</p>
          </div>
        </div>

        {/* Bottom wave cutout */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Free Shipping Banner */}
      {subtotal < 500 && cartItems.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <LocalShippingIcon className="w-5 h-5" />
              <span className="text-sm">
                Add <strong>${(500 - subtotal).toFixed(2)}</strong> more to unlock <strong>FREE shipping!</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-2">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Cart Items ── */}
            <div className="flex-1">
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-[#001e3a] font-semibold text-lg">{cartItems.length} Items</span>
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <DeleteOutlineIcon className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row gap-0">
                      {/* Image */}
                      <div className="relative sm:w-48 h-52 sm:h-auto flex-shrink-0 bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {!item.inStock && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        )}
                        <div className="absolute top-3 right-3 bg-[#001e3a]/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <StarIcon sx={{ fontSize: 12 }} /> {item.rating}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-xs font-semibold tracking-widest uppercase text-[#0f3c4c]/60">
                              {getCategoryName(item.categoryId)}
                            </span>
                            <h3 className="text-xl font-semibold text-[#001e3a] mt-0.5 leading-snug">{item.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                            <span className={`inline-block mt-2 text-xs px-3 py-0.5 rounded-full font-medium ${item.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                              {item.inStock ? '● In Stock' : '● Out of Stock'}
                            </span>
                          </div>
                          {/* Price desktop */}
                          <div className="hidden sm:block text-right flex-shrink-0">
                            <p className="text-2xl font-bold text-[#001e3a]">${item.price}</p>
                            <p className="text-sm text-gray-300 line-through">${Math.round(item.price * 1.25)}</p>
                            <p className="text-emerald-500 text-xs font-semibold mt-0.5">Save 20%</p>
                          </div>
                        </div>

                        {/* Bottom row */}
                        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
                          {/* Price mobile */}
                          <div className="sm:hidden">
                            <p className="text-xl font-bold text-[#001e3a]">${item.price}</p>
                            <p className="text-xs text-gray-300 line-through">${Math.round(item.price * 1.25)}</p>
                            <p className="text-emerald-500 text-xs font-semibold">Save 20%</p>
                          </div>

                          {/* Qty */}
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">Qty</span>
                            <div
                              className="flex items-center rounded-xl overflow-hidden border-2 border-gray-100"
                              style={{ background: '#f8f9fb' }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-2 hover:bg-[#001e3a] hover:text-white transition-colors text-gray-500"
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 text-center font-bold text-[#001e3a] bg-transparent focus:outline-none appearance-none"
                                style={{ MozAppearance: 'textfield' }}
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 hover:bg-[#001e3a] hover:text-white transition-colors text-gray-500"
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </button>
                            </div>
                            <span className="text-sm text-gray-400 font-medium">
                              = <span className="text-[#001e3a] font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleWishlist(item.id)}
                              className={`p-2.5 rounded-xl border-2 transition-all ${
                                item.isWishlisted
                                  ? 'border-red-200 bg-red-50 text-red-500 scale-110'
                                  : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                              }`}
                            >
                              {item.isWishlisted ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2.5 border-2 border-gray-200 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[#001e3a] hover:text-[#0f3c4c] font-medium group transition-colors"
                >
                  <ArrowForwardIcon className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:w-96">
              <div
                className="rounded-3xl overflow-hidden shadow-2xl sticky top-4"
                style={{ background: NAV_BG }}
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-light text-white">Order</h2>
                  <h2 className="text-2xl font-bold text-white">Summary</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Promo Code */}
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Promo Code</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <LocalOfferIcon className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          disabled={promoApplied}
                          className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 text-sm"
                        />
                      </div>
                      <button
                        onClick={applyPromoCode}
                        disabled={promoApplied || !promoCode}
                        className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          promoApplied
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white text-[#001e3a] hover:bg-white/90 disabled:bg-white/20 disabled:text-white/30'
                        }`}
                      >
                        {promoApplied ? '✓ Applied' : 'Apply'}
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                        <CheckCircleIcon sx={{ fontSize: 14 }} />
                        WELCOME20 — 20% off applied!
                      </p>
                    )}
                    {!promoApplied && (
                      <p className="text-white/30 text-xs mt-1.5">Try: <span className="text-white/50 font-mono">WELCOME20</span></p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex justify-between text-white/60 text-sm">
                      <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 text-sm">
                      <span>Product Savings</span>
                      <span>−${savings.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-emerald-400 text-sm">
                        <span>Promo Discount (20%)</span>
                        <span>−${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/60 text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <span className="text-emerald-400">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-white/60 text-sm">
                      <span>Estimated Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-widest">Total</p>
                      <p className="text-3xl font-bold text-white">${total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-xs font-medium">You save</p>
                      <p className="text-emerald-400 font-bold">${(savings + promoDiscount).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full bg-white text-[#001e3a] py-4 rounded-2xl font-bold text-base hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                    Proceed to Checkout
                    <ArrowOutwardIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 text-center pt-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                        <LocalShippingIcon sx={{ fontSize: 18 }} className="text-white/70" />
                      </div>
                      <span className="text-xs text-white/40">Free Ship</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                        <SecurityIcon sx={{ fontSize: 18 }} className="text-white/70" />
                      </div>
                      <span className="text-xs text-white/40">Secure Pay</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                        <CachedIcon sx={{ fontSize: 18 }} className="text-white/70" />
                      </div>
                      <span className="text-xs text-white/40">Free Return</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter card */}
              <div className="mt-6 rounded-3xl border-2 border-[#001e3a]/10 p-6 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#001e3a] flex items-center justify-center">
                    <PercentIcon sx={{ fontSize: 18 }} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#001e3a] text-lg">Member Exclusive</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Subscribe and get <strong className="text-[#001e3a]">15% off</strong> your next order.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#001e3a]/10 focus:border-[#001e3a]/30 focus:outline-none bg-white text-[#001e3a] text-sm mb-3 placeholder-gray-300"
                />
                <button className="w-full bg-[#001e3a] text-white font-semibold py-2.5 rounded-xl hover:bg-[#0f3c4c] transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-16 text-center">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: `linear-gradient(135deg, ${NAV_BG}, ${ACCENT})` }}
            >
              <ShoppingCartIcon sx={{ fontSize: 48 }} className="text-white" />
            </div>
            <h2 className="text-3xl font-light text-[#001e3a] mb-1">Your cart</h2>
            <h2 className="text-3xl font-bold text-[#001e3a] mb-3">is empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#001e3a] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#0f3c4c] transition-colors"
            >
              Start Shopping
              <ArrowOutwardIcon sx={{ fontSize: 18 }} />
            </Link>
          </div>
        )}

        {/* Recommendations */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">You may also like</p>
              <h2 className="text-3xl font-light text-[#001e3a]">Frequently <span className="font-bold">Bought Together</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {productsData.slice(10, 16).map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-[#001e3a] truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[#001e3a] font-bold text-sm">${product.price}</p>
                      <p className="text-xs text-gray-300 line-through">${Math.round(product.price * 1.25)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(8px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-8px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(4px); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

export default CartContent
