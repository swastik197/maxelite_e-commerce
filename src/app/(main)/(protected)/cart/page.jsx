"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
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

// Import data from config
import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'

const CartContent = () => {
  const [cartItems, setCartItems] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [notification, setNotification] = useState(null)


  
  useEffect(() => {
    // Simulate cart items (random products with quantities)
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

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + Math.round(item.price * 1.25) * item.quantity, 0)
  const savings = originalTotal - subtotal
  const promoDiscount = promoApplied ? subtotal * 0.2 : 0
  const shipping = subtotal > 500 ? 0 : 25
  const tax = (subtotal - promoDiscount) * 0.08
  const total = subtotal - promoDiscount + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <CheckCircleIcon className="w-5 h-5" />
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShoppingCartIcon className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-purple-200 mt-1">{cartItems.length} items in your cart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Free Shipping Banner */}
      {subtotal < 500 && cartItems.length > 0 && (
        <div className="bg-yellow-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <LocalShippingIcon className="w-5 h-5" />
              <span>
                Add <strong>${(500 - subtotal).toFixed(2)}</strong> more to get <strong>FREE shipping!</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              {/* Actions Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
                <span className="text-gray-600 font-medium">{cartItems.length} items</span>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                >
                  <DeleteOutlineIcon className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {!item.inStock && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">
                              {getCategoryName(item.categoryId)}
                            </p>
                            <h3 className="text-lg font-semibold text-gray-800 mt-1">{item.name}</h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <span className={`text-sm px-2 py-0.5 rounded ${item.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                              <span className="text-sm text-gray-500">Rating: {item.rating}★</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">${item.price}</p>
                            <p className="text-sm text-gray-400 line-through">${Math.round(item.price * 1.25)}</p>
                            <p className="text-green-600 text-sm font-medium">Save 20%</p>
                          </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t gap-4">
                          {/* Quantity Control */}
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600 text-sm">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <RemoveIcon className="w-4 h-4" />
                              </button>
                              <span className="px-4 font-medium text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <AddIcon className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-gray-600 text-sm">
                              Total: <strong className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</strong>
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleWishlist(item.id)}
                              className={`p-2 rounded-lg border transition-colors ${
                                item.isWishlisted
                                  ? 'border-red-200 bg-red-50 text-red-500'
                                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {item.isWishlisted ? (
                                <FavoriteIcon className="w-5 h-5" />
                              ) : (
                                <FavoriteBorderIcon className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
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
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <ArrowForwardIcon className="w-5 h-5 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-96">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <LocalOfferIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        disabled={promoApplied}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <button
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        promoApplied
                          ? 'bg-green-100 text-green-600'
                          : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-500'
                      }`}
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      WELCOME20 - 20% off applied!
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">Try: WELCOME20 for 20% off</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Product Savings</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount (20%)</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-6 border-b">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-purple-600">${total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors mt-6">
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <LocalShippingIcon className="w-6 h-6 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-600">Free Shipping</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <SecurityIcon className="w-6 h-6 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-600">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CachedIcon className="w-6 h-6 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-600">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotional Card */}
              <div className="mt-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <PercentIcon className="w-8 h-8" />
                  <h3 className="font-bold text-lg">Member Exclusive</h3>
                </div>
                <p className="text-purple-200 text-sm mb-4">
                  Sign up for our newsletter and get 15% off your next order!
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
                />
                <button className="w-full bg-white text-purple-700 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCartIcon className="w-12 h-12 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Recommendations */}
        {cartItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {productsData.slice(10, 16).map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-800 truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-purple-600 font-bold">${product.price}</p>
                      <p className="text-xs text-gray-400 line-through">${Math.round(product.price * 1.25)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartContent
