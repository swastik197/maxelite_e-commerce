"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from '@/context/AuthContext';
import categoriesData from '@/config/categories.json';
import productsData from '@/config/products.json';

const Navbar = () => {
  const { user, logout, loading, openAuthModal } = useAuth()
  const router = useRouter()
  const [categorystat, setCategorystat] = useState(false)
  const [profilestat, setProfilestat] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const searchRef = useRef(null)

  // Use categories from config
  const categories = categoriesData

  const handleProtectedNavigation = (e) => {
    if (!user) {
      e.preventDefault()
      openAuthModal()
    }
  }

  const Profiles = [
    { name: 'My Account', href: `${user?.id ? `/user_profile/${user.id}` : '#'}` },
    { name: 'Orders', href:     `${user?.id ? `/user_profile/${user.id}` : '#'}` },
    { name: 'Wishlist', href:   `${user?.id ? `/wishlist/${user.id}` : '#'}` },
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Handle click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = productsData
        .filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))

      // Navigate to results page
      router.push(`/results?q=${encodeURIComponent(searchQuery)}`)
      setSearchFocused(false)
    }
  }

  const handleSuggestionClick = (product) => {
    // Save product name to recent searches
    const newRecent = [product.name, ...recentSearches.filter(s => s !== product.name)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem('recentSearches', JSON.stringify(newRecent))

    // Navigate to product page
    router.push(`/product/${product.slug}`)
    setSearchQuery('')
    setSearchFocused(false)
  }

  const handleRecentSearchClick = (search) => {
    setSearchQuery(search)
    router.push(`/results?q=${encodeURIComponent(search)}`)
    setSearchFocused(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const removeRecentSearch = (search, e) => {
    e.stopPropagation()
    const newRecent = recentSearches.filter(s => s !== search)
    setRecentSearches(newRecent)
    localStorage.setItem('recentSearches', JSON.stringify(newRecent))
  }

  // Trending searches (static for demo)
  const trendingSearches = ['Modern Sofa', 'Oak Furniture', 'Bedroom Decor', 'Office Chair']

  return (
    <>
      <nav className='bg-[#001e3a] flex justify-between sticky top-0 items-center z-50'>
        {/* <div className={`relative w-64 h-16 ${bgColor} rounded-br-[30px] `}>
                   <div className="  w-16 h-16 pointer-events-none overflow-hidden">

                        <div
                            className={`absolute top-[64] w-3/4 h-1/2 border-0 ${bgColor} rounded-br-[-30px]`}
                           >
                            <div
                                className={`w-auto h-full border-0  bg-[#001e3a] rounded-tl-[30px]`}
                               ></div>
                        </div>
                    </div>
                    
                </div> */}


        <div className='bg-white relative flex w-auto   '>
          <img src="/MAXELITE_LOGO.png" alt="Logo" className="h-12 w-28 object-contain rounded-lg m-0 px-6 py-2" />
          <div
            className={`absolute bottom-0 right-0 w-1/4 h-1/2 border-0 bg-[#001e3a]  `}>
            <div
              className={`w-auto h-full border-0  bg-white rounded-br-[30px]`}
            ></div>
          </div>



        </div>
        <div
          className='hidden p-2 m-2 rounded-2xl h-fit gap-2 text-white bg-[#49769F] md:flex relative group cursor-pointer'
          onMouseEnter={() => setCategorystat(true)}
          onMouseLeave={() => setCategorystat(false)}

        >
          {categorystat ? <MenuOpenIcon /> : <MenuIcon />}
          category

          {/* Dropdown Menu */}
          {categorystat && (
            // <div className='absolute top-full z-30 left-0 mt-0 w-56 bg-white rounded-lg shadow-lg py-2 '>
            //   {categories.map((category, index) => (
            //     <Link
            //       key={category.id}
            //       href={`/category?slug=${category.slug}`}
            //       className='block px-4 py-2 text-gray-800 hover:bg-purple-100 cursor-pointer transition'
            //     >
            //       {category.name}
            //     </Link>
            //   ))}
            // </div>
            <div className='absolute top-full z-30 left-0 mt-1 w-72 bg-white/95  backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/20 py-3 px-2 overflow-hidden'>
              <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2'>Browse Categories</p>
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category?slug=${category.slug}`}
                  className='group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 cursor-pointer transition-all duration-200'
                >
                  <span className='flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100/60 text-[#001D39] group-hover:bg-[#001D39] group-hover:text-white group-hover:shadow-md group-hover:shadow-purple-200 transition-all duration-200 text-sm font-bold'>
                    {category.name.charAt(0)}
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-[#001D39] group-hover:text-[#001D39] transition-colors'>{category.name}</p>
                    <p className='text-[11px] text-gray-400 truncate'>{category.description}</p>
                  </div>
                  <svg className='w-4 h-4 text-gray-300 group-hover:text-[#001D39] group-hover:translate-x-0.5 transition-all duration-200' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </Link>
              ))}
              <div className='mt-2 mx-2 border-t border-gray-100 pt-2'>
                <Link href='/category' className='flex items-center justify-center gap-1 text-xs font-medium text-[#001D39] hover:text-[#001D39] py-1.5 rounded-lg hover:bg-purple-50 transition-all'>
                  View All Categories
                  <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        <form
          ref={searchRef}
          onSubmit={handleSearch}
          className='hidden rounded-3xl m-2 p-2  bg-[#49769F] sm:flex items-center lg:w-1/3 relative'
        >
          <input
            className='px-2 text-white w-full focus:outline-none placeholder-purple-200'
            placeholder='Search for Products, Categories..'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          <button type="submit">
            <SearchIcon className="cursor-pointer hover:text-purple-200" />
          </button>

          {/* Search Suggestions Dropdown */}
          {searchFocused && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto'>
              {/* Search Results */}
              {suggestions.length > 0 && (
                <div className='p-3'>
                  <p className='text-xs font-semibold text-gray-500 uppercase mb-2 px-2'>Products</p>
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className='flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors'
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className='w-12 h-12 object-cover rounded-lg bg-gray-100'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-gray-800 font-medium truncate'>{product.name}</p>
                        <p className='text-purple-600 font-semibold text-sm'>${product.price}</p>
                      </div>
                      <div className='flex items-center gap-1 text-yellow-500'>
                        <span className='text-sm'>★</span>
                        <span className='text-gray-600 text-sm'>{product.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery.trim() && suggestions.length === 0 && (
                <div className='p-6 text-center text-gray-500'>
                  <p>No products found for "{searchQuery}"</p>
                  <p className='text-sm mt-1'>Try a different search term</p>
                </div>
              )}

              {/* Recent Searches */}
              {!searchQuery.trim() && recentSearches.length > 0 && (
                <div className='p-3 border-b'>
                  <div className='flex items-center justify-between px-2 mb-2'>
                    <p className='text-xs font-semibold text-gray-500 uppercase'>Recent Searches</p>
                    <button
                      onClick={clearRecentSearches}
                      className='text-xs text-purple-600 hover:text-purple-700'
                    >
                      Clear All
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className='flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors group'
                    >
                      <div className='flex items-center gap-2'>
                        <HistoryIcon className='w-4 h-4 text-gray-400' />
                        <span className='text-gray-700'>{search}</span>
                      </div>
                      <button
                        onClick={(e) => removeRecentSearch(search, e)}
                        className='opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all'
                      >
                        <CloseIcon className='w-4 h-4 text-gray-400' />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {!searchQuery.trim() && (
                <div className='p-3'>
                  <p className='text-xs font-semibold text-gray-500 uppercase mb-2 px-2 flex items-center gap-1'>
                    <TrendingUpIcon className='w-4 h-4' />
                    Trending Searches
                  </p>
                  <div className='flex flex-wrap gap-2 px-2'>
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search)
                          handleRecentSearchClick(search)
                        }}
                        className='px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 rounded-full text-sm transition-colors'
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Quick Links */}
              {!searchQuery.trim() && (
                <div className='p-3 border-t'>
                  <p className='text-xs font-semibold text-gray-500 uppercase mb-2 px-2'>Categories</p>
                  <div className='grid grid-cols-2 gap-1'>
                    {categories.slice(0, 4).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category?slug=${category.slug}`}
                        onClick={() => setSearchFocused(false)}
                        className='p-2 hover:bg-purple-50 rounded-lg text-gray-700 text-sm transition-colors'
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        <div className='hidden gap-4 lg:flex items-center p-0 m-0'>

          <Link href="/wishlist" onClick={handleProtectedNavigation} className='flex cursor-pointer p-2 gap-1 mx-4 hover:text-purple-200 transition-colors'>
            <FavoriteBorderIcon />
            <p>Wishlist</p>
          </Link>
          <Link href="/cart" onClick={handleProtectedNavigation} className='flex cursor-pointer p-2 gap-1 mx-4 hover:text-purple-200 transition-colors'>
            <ShoppingCartIcon />
            <p>Cart</p>
          </Link>
          <div className='relative bg-[#49769F] rounded-2xl p-2 m-2 flex gap-1 mx-4 group cursor-pointer '
            onMouseEnter={() => setProfilestat(true)}
            onMouseLeave={() => setProfilestat(false)}>
            <PersonIcon fontSize="medium"
            />
            {/* <Link href='/Auth'>Login</Link> */}
            {user ? (<>
              <div className="flex gap-4 items-center">
                <span>Hello, {user.name}</span>

              </div>

              {profilestat && (
                <div className='absolute top-full left-0 mt-0 w-full bg-white rounded-lg shadow-lg py-2 z-50'>
                  {Profiles.map((profile, index) => (
                    <Link
                      key={index}
                      href={profile.href}
                      className='block px-4 py-2 text-gray-800 hover:bg-purple-100 cursor-pointer transition'
                    >
                      {profile.name}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className='block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition'
                  >
                    Logout
                  </button>
                </div>
              )}</>
            ) : (
              <div className="flex gap-4">
                <button onClick={openAuthModal} className="hover:text-purple-200 transition-colors">Login</button>
              </div>
            )}

          </div>
        </div>

        <div className='flex lg:hidden items-center relative'>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='mx-4 text-white hover:text-purple-300 transition-colors focus:outline-none'
          >
            {mobileMenuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
          </button>

          {mobileMenuOpen && (
            <div className='absolute top-[calc(100%+10px)] right-4 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/20 py-4 pb-2 z-50 flex flex-col gap-2'>
              
              {/* User Section */}
              <div className="px-5 pb-3 border-b border-gray-100">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#001D39] truncate">Hello, {user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email || 'Welcome back!'}</p>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { openAuthModal(); setMobileMenuOpen(false); }} className="w-full py-2.5 bg-gradient-to-r from-[#001e3a] to-[#003666] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-200">
                    Login / Sign Up
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="px-3 flex flex-col gap-1 mt-1">
                <Link href="/cart" onClick={(e) => { setMobileMenuOpen(false); handleProtectedNavigation(e); }} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-purple-100/50 group-hover:text-purple-600 transition-colors">
                    <ShoppingCartIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm group-hover:text-[#001e3a] transition-colors">Shopping Cart</span>
                </Link>
                <Link href="/wishlist" onClick={(e) => { setMobileMenuOpen(false); handleProtectedNavigation(e); }} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-pink-100/50 group-hover:text-pink-600 transition-colors">
                    <FavoriteBorderIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm group-hover:text-[#001e3a] transition-colors">My Wishlist</span>
                </Link>
                {user && (
                  <Link href={`/user_profile/${user.id}`} onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-green-100/50 group-hover:text-green-600 transition-colors">
                      <PersonIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm group-hover:text-[#001e3a] transition-colors">My Account</span>
                  </Link>

                )}
              </div>

              {/* Categories */}
              <div className="px-3 mt-2 max-h-48 overflow-y-auto">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Shop by Category</p>
                <div className="flex flex-col gap-0.5">
                  {categories.slice(0, 4).map(cat => (
                    <Link key={cat.id} href={`/category?slug=${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#001e3a] hover:pl-4 transition-all duration-200">
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/category" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 mt-1 rounded-lg text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors">
                    Explore All Categories →
                  </Link>
                </div>
              </div>

              {/* Logout Footer */}
              {user && (
                <div className="px-3 mt-2 border-t border-gray-100 pt-2">
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar