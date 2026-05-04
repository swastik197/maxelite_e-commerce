"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarIcon from '@mui/icons-material/Star'
import ShareIcon from '@mui/icons-material/Share'
import SortIcon from '@mui/icons-material/Sort'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
const NAV_BG = '#001e3a'
const ACCENT = '#0f3c4c'

const WishlistContent = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('dateAdded')
  const [notification, setNotification] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
    useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 100)
      return () => clearTimeout(timer)
    }, [])
  
  

  const fetchWishlistItems = async () => {
    const res = await fetch('/api/user/wishlist', { cache: 'no-store' })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to load wishlist')
    }

    setWishlistItems(Array.isArray(data.wishlist) ? data.wishlist : [])
  }

  const fetchRecommendedProducts = async () => {
    const res = await fetch('/api/product/search/result?q=a&limit=6&sort=rating', { cache: 'no-store' })
    const data = await res.json()

    if (!res.ok) {
      return
    }

    const products = Array.isArray(data.products) ? data.products : []
    setRecommendedProducts(products.map((product) => ({
      id: String(product._id || product.id),
      slug: product.slug || '',
      name: product.name || '',
      image: product.image || '',
      price: Number(product.salePrice || product.price || 0),
    })))
  }

  useEffect(() => {
    const load = async () => {
      try {
        await fetchWishlistItems()
      } catch {
        showNotification('Unable to load wishlist from database', 'error')
      }

      fetchRecommendedProducts()
    }

    load()
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const removeFromWishlist = (productId) => {
    const previousItems = wishlistItems
    setWishlistItems(prev => prev.filter(item => item.id !== productId))

    fetch('/api/user/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to remove wishlist item')
        setWishlistItems(Array.isArray(data.wishlist) ? data.wishlist : [])
        showNotification('Item removed from wishlist')
      })
      .catch(() => {
        setWishlistItems(previousItems)
        showNotification('Unable to update wishlist', 'error')
      })
  }

  const addToCart = (product) => {
    fetch('/api/user/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to add to cart')
        showNotification(`${product.name} added to cart!`)
      })
      .catch(() => showNotification('Unable to add to cart', 'error'))
  }

  const addAllToCart = () => {
    if (wishlistItems.length === 0) return

    const ids = wishlistItems.map((item) => item.id)
    fetch('/api/user/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: ids, quantity: 1 })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to add all to cart')
        showNotification(`${wishlistItems.length} items added to cart!`)
      })
      .catch(() => showNotification('Unable to add all items to cart', 'error'))
  }

  const clearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      const previousItems = wishlistItems
      setWishlistItems([])

      fetch('/api/user/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to clear wishlist')
          setWishlistItems(Array.isArray(data.wishlist) ? data.wishlist : [])
          showNotification('Wishlist cleared')
        })
        .catch(() => {
          setWishlistItems(previousItems)
          showNotification('Unable to clear wishlist', 'error')
        })
    }
  }

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return a.price - b.price
      case 'priceHigh':
        return b.price - a.price
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'dateAdded':
      default:
        return new Date(b.addedAt) - new Date(a.addedAt)
    }
  })

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
      <div
        className="relative w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAV_BG} 0%, ${ACCENT} 100%)`, minHeight: '100px' }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white/20 rounded-full animate-[floatParticle_8s_ease-in-out_infinite]" />
          <div className="absolute top-[60%] left-[80%] w-3 h-3 bg-blue-300/15 rounded-full animate-[floatParticle_10s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[40%] left-[50%] w-1.5 h-1.5 bg-white/20 rounded-full animate-[floatParticle_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[75%] left-[30%] w-2.5 h-2.5 bg-white/10 rounded-full animate-[floatParticle_12s_ease-in-out_infinite_0.5s]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">Your wishlist</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-1">Shopping</h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white">Wish</h1>
            <p className="text-white/50 mt-2 text-sm">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {/* Bottom wave cutout */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Promotional Banner */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {wishlistItems.length > 0 ? (
          <>
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">{wishlistItems.length} items</span>
                <button
                  onClick={clearWishlist}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                >
                  <DeleteOutlineIcon className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <SortIcon className="w-5 h-5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="dateAdded">Recently Added</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <GridViewIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <ViewListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:gap-6 gap-2">
                {sortedItems.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {!product.inStock && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FavoriteIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-purple-600 font-medium mb-1">
                        {product.category || 'Unknown'}
                      </p>
                      <h3 className="font-medium text-gray-800 truncate mb-2">{product.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">
                          <StarIcon className="w-4 h-4" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xl font-bold text-gray-800">${product.price}</span>
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${Math.round(product.price * 1.25)}
                          </span>
                        </div>
                        <span className="text-green-600 text-sm font-medium">20% off</span>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">
                        Added {new Date(product.addedAt).toLocaleDateString()}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                            product.inStock
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                        >
                          <DeleteOutlineIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {sortedItems.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 bg-gray-100 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {!product.inStock && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium mb-1">
                              {product.category || 'Unknown'}
                            </p>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FavoriteIcon className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">
                            <StarIcon className="w-4 h-4" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                          <span className={`text-sm px-2 py-0.5 rounded ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                          <span className="text-gray-400 line-through">${Math.round(product.price * 1.25)}</span>
                          <span className="text-green-600 font-medium">20% off</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                              product.inStock
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCartIcon className="w-4 h-4" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                          >
                            <DeleteOutlineIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                            <ShareIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendedProducts.map((product) => (
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
                      <p className="text-purple-600 font-bold mt-1">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty Wishlist */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FavoriteBorderIcon className="w-12 h-12 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love by clicking the heart icon on any product.</p>
            <Link
              href="/"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistContent
