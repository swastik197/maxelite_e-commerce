"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
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
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

// Import data from config
import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'

const WishlistContent = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('dateAdded')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    // Simulate wishlist items (random products)
    const shuffled = [...productsData].sort(() => 0.5 - Math.random())
    const itemsWithWishlistData = shuffled.slice(0, 8).map(product => ({
      ...product,
      addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
    setWishlistItems(itemsWithWishlistData)
  }, [])

  const getCategoryName = (categoryId) => {
    const category = categoriesData.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown'
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
    showNotification('Item removed from wishlist')
  }

  const addToCart = (product) => {
    // Here you would typically add to cart context/state
    showNotification(`${product.name} added to cart!`)
  }

  const addAllToCart = () => {
    // Here you would add all items to cart
    showNotification(`${wishlistItems.length} items added to cart!`)
  }

  const clearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([])
      showNotification('Wishlist cleared')
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
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <FavoriteIcon className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-purple-200 mt-1">{wishlistItems.length} items saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <LocalOfferIcon className="w-12 h-12" />
            <div>
              <h3 className="text-xl font-bold">Don't miss out!</h3>
              <p className="text-pink-100">Some items in your wishlist are on sale. Grab them before they're gone!</p>
            </div>
          </div>
          <button
            onClick={addAllToCart}
            className="mt-4 md:mt-0 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
          >
            Add All to Cart
          </button>
        </div>
      </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        {getCategoryName(product.categoryId)}
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
                    <div className="relative w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
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
                              {getCategoryName(product.categoryId)}
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
                {productsData.slice(0, 6).map((product) => (
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
