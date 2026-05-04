"use client"
import React, { useState, useEffect, Suspense, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import StarIcon from '@mui/icons-material/Star'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import VerifiedIcon from '@mui/icons-material/Verified'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Import data from config
import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'

const CategoryPageContent = () => {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('slug') || 'living-room'

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [notification, setNotification] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [showSortMenu, setShowSortMenu] = useState(false)
  const sortBtnRef = useRef(null)
  const [popoverStyle, setPopoverStyle] = useState({})

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    // Find category by slug
    const foundCategory = categoriesData.find(cat => cat.slug === categorySlug) || categoriesData[0]
    setCategory(foundCategory)

    // Filter products by category
    const categoryProducts = productsData.filter(product => product.categoryId === foundCategory.id)
    setProducts(categoryProducts)
    setFilteredProducts(categoryProducts)
  }, [categorySlug])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...products]

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter(p => {
        const rating = parseFloat(p.rating)
        return selectedRatings.some(r => rating >= r)
      })
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.inStock)
    }

    // Sorting
    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price)
        break
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        break
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      default:
        // Featured - no specific sort
        break
    }

    setFilteredProducts(result)
  }, [products, priceRange, selectedRatings, inStockOnly, sortBy])

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
    const isAdding = !wishlist.includes(productId)
    showNotification(isAdding ? 'Added to wishlist!' : 'Removed from wishlist')
  }

  const addToCart = (product) => {
    showNotification(`${product.name} added to cart!`)
  }

  const toggleRating = (rating) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 5000])
    setSelectedRatings([])
    setInStockOnly(false)
  }
  const NAV_BG = '#001e3a'
  const ACCENT = '#0f3c4c'
  // Promotional banners for category
  const promotionalBanners = [
    {
      id: 1,
      title: `${category?.name || 'Category'} Sale!`,
      subtitle: "Up to 40% off on selected items",
      bgImage: "https://placehold.co/1200x300/7c3aed/ffffff?text=Category+Sale",
      buttonText: "Shop Now"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-green-500 text-white">
          <CheckCircleIcon className="w-5 h-5" />
          {notification}
        </div>
      )}

      {/* Category Hero Banner */}
      <div
        style={{ background: `linear-gradient(135deg, ${NAV_BG} 0%, ${ACCENT} 100%)`, minHeight: '150px' }}
        className={`relative w-full overflow-hidden pb-4`}

      // relative text-white bg-cover bg-center ${category?.image ? '' : 'bg-gradient-to-r from-[#0A4174] to-[#001D39]'}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#0A4174]/20 to-[#001D39]/85"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-2">
          <div className="relative py-4 z-10 flex flex-row items-center justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-purple-200 text-sm m-1">
                <Link href="/" className="hover:text-white">Home</Link>
                <ArrowForwardIosIcon className="w-1 h-1" />
                <span>Categories</span>
                <ArrowForwardIosIcon className="w-1 h-1" />
                <span className="text-white">{category?.name}</span>
              </div>

              <h1 className="text-2xl font-bold mb-2">{category?.name}</h1>
              <p className="text-purple-200 text-sm max-w-xl">{category?.description}</p>

            </div>

            <div className="hidden md:flex mt-2 mb-2 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <LocalOfferIcon className="w-12 h-12 text-yellow-300 mb-2" />
                <p className="font-bold text-md">Special Offer!</p>
                <p className="text-purple-200 text-sm">Extra 10% off on orders above $500</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Promotional Ad Banner */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Sort / Filter toolbar */}
        <div className="bg-white md:hidden rounded-xl shadow-sm p-3 mb-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <button ref={sortBtnRef} onClick={() => {
              if (!showSortMenu && sortBtnRef.current) {
                const rect = sortBtnRef.current.getBoundingClientRect();
                setPopoverStyle({
                  position: 'fixed',
                  top: rect.bottom + window.scrollY + 8,
                  left: rect.left + window.scrollX,
                  width: 192
                })
              }
              setShowSortMenu(prev => !prev)
            }} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 px-2 py-1">
              <SortIcon className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Sort</span>
            </button>
            <div className="w-px h-6 bg-gray-100" />
            <button onClick={() => setShowFilters(prev => !prev)} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 px-2 py-1">
              <TuneIcon className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Filter</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Showing <strong>{filteredProducts.length}</strong></div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}><GridViewIcon className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}><ViewListIcon className="w-4 h-4" /></button>
            </div>
          </div>
          {showSortMenu && typeof document !== 'undefined' && createPortal(
            <div style={popoverStyle} className="bg-white rounded-lg shadow-md z-50">
              <ul className="divide-y">
                {[
                  { key: 'featured', label: 'Featured' },
                  { key: 'newest', label: 'Newest' },
                  { key: 'priceLow', label: 'Price: Low to High' },
                  { key: 'priceHigh', label: 'Price: High to Low' },
                  { key: 'rating', label: 'Highest Rated' }
                ].map(opt => (
                  <li key={opt.key}>
                    <button
                      onClick={() => { setSortBy(opt.key); setShowSortMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${sortBy === opt.key ? 'font-semibold' : ''}`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>,
            document.body
          )}
        </div>

        {/* Quick chips / categories (scrollable) */}


        {/* Promo card */}
        <div className="bg-white rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full relative h-38 md:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              {/* Replace with real image if available */}
              <img src="/banner-placeholder.png" alt="promo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <div className="md:hidden p-2">
                <span className="text-xs text-gray-500">AD</span>
              </div>
              <div className="flex-1 left-2 absolute bottom-2 p-1">
                <div className="flex  justify-between">
                  <span className="text-xs text-gray-400">AD</span>
                  <button className="p-1 md:hidden rounded-full text-gray-600">❤</button>
                </div>

                <p className="text-sm text-gray-600 mt-2 mb-2">Explore curated casual sneakers and grab limited time offers from top brands.</p>
                <button className="inline-flex items-center gap-2 text-purple-600 font-semibold">Shop Collection <ArrowForwardIcon className="w-4 h-4" /></button>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className={`lg:w-64 absolute top-82 z-30 md:z-0 md:static shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <TuneIcon className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-purple-600 text-sm font-medium hover:text-purple-700"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Price Range</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => toggleRating(rating)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Availability</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-600">In Stock Only</span>
                </label>
              </div>

              {/* Quick Deals */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-2">Today's Deals</h4>
                <p className="text-sm text-purple-600 mb-3">Up to 30% off on selected items</p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  View Deals
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 hidden md:flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <FilterListIcon className="w-5 h-5" />
                  Filters
                </button>
                <span className="text-gray-600">
                  Showing <strong>{filteredProducts.length}</strong> products
                </span>
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
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-2">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-sm overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative min-h-52 bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {!product.inStock && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          20% OFF
                        </span>
                      </div>
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${wishlist.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:text-red-500'
                          }`}
                      >
                        {wishlist.includes(product.id) ? (
                          <FavoriteIcon className="w-5 h-5" />
                        ) : (
                          <FavoriteBorderIcon className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex absolute bottom-1 items-center gap-2">
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">
                          <StarIcon className="w-4 h-4" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-medium text-gray-800 hover:text-purple-600 truncate">{product.name}</h3>
                      </Link>



                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-xl font-bold text-gray-800">${product.price}</span>
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${Math.round(product.price * 1.25)}
                          </span>
                        </div>
                      </div>


                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-64 bg-gray-100 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {!product.inStock && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          20% OFF
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/product/${product.slug}`}>
                              <h3 className="text-xl font-semibold text-gray-800 hover:text-purple-600">{product.name}</h3>
                            </Link>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                          </div>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-full transition-colors ${wishlist.includes(product.id)
                              ? 'text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                              }`}
                          >
                            {wishlist.includes(product.id) ? (
                              <FavoriteIcon className="w-6 h-6" />
                            ) : (
                              <FavoriteBorderIcon className="w-6 h-6" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">
                            <StarIcon className="w-4 h-4" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                          <span className={`text-sm px-2 py-0.5 rounded ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <LocalShippingIcon className="w-4 h-4" />
                            Free Shipping
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                          <span className="text-gray-400 line-through">${Math.round(product.price * 1.25)}</span>
                          <span className="text-green-600 font-medium">Save 20%</span>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${product.inStock
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FilterListIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No products found</h2>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Promotional Banner */}
        <div className="mt-12 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe & Save!</h3>
              <p className="text-purple-200 max-w-md">
                Join our newsletter for exclusive deals, early access to sales, and personalized recommendations.
              </p>
            </div>
            <div className="mt-6 md:mt-0 hidden md:flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
              />
              <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CategoryPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  )
}

export default CategoryPage
