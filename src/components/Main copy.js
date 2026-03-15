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

const InteriorCard = () => {
    // Define colors to match the image
    const cardColor = 'bg-[#0f3c4c]'; // Deep Teal
    const cardColorHex = '#001e3a';   // For use in arbitrary shadow values
    const bgColor = 'bg-white';
    //  const bgColor = 'bg-[#BDD8E9]';
    // const bgColorHex = '#BDD8E9';
    const bgColorHex = '#FFFFFF';







    const [categorystat, setCategorystat] = useState(false)
    const [profilestat, setProfilestat] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [recentSearches, setRecentSearches] = useState([])
    const searchRef = useRef(null)

    // Use categories from config
    const categories = categoriesData

    const Profiles = [
        { name: 'My Account', href: '/user_profile' },
        { name: 'Orders', href: '/user_profile' },
        { name: 'Wishlist', href: '/wishlist' },
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
        <div className={`min-h-96 md:min-h-screen ${bgColor} border-white flex items-center justify-center pb-6 lg:pb-0.5`}>

            {/* MAIN CARD CONTAINER 
        We use 'relative' to position the tabs and cutouts absolutely.
      */}
            <div className={`relative w-full max-w-screen h-full sm:h-screen ${cardColor} rounded-[0px] rounded-tl-none flex overflow-visible`}
                style={{
                    backgroundImage: "url('/main.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>

                {/* C:\Users\user\Desktop\maxelite_ecommerce\public\==============================
            1. TOP LEFT TAB SYSTEM
           ============================== */}

                {/* The Tab Itself */}





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




                {/* The "Scoop" (Inverted Radius) connecting Tab to Card Body */}
                <div className="  w-16 h-16 pointer-events-none overflow-hidden">
                    {/* Logic: A transparent box with a rounded BOTTOM-LEFT corner.
            The Shadow matches the card color and is cast down and left 
            to fill the empty space, creating a concave curve.
          */}
                    {/* <div
                        className={`w-3/4 h-1/2 border-0 ${bgColor} rounded-br-[-30px]`}
                        style={{ boxShadow: `-40px 40px 0 0 ${cardColorHex}` }}>
                        <div
                            className={`w-full h-full border-0  bg-[#001e3a] rounded-tl-[30px]`}
                            ></div>
                    </div> */}
                </div>


                {/* ==============================
            2. BOTTOM RIGHT CUTOUT SYSTEM
           ============================== */}

                {/* The "Hole" (White "Hill" blocking the card) */}
                <div className={`absolute lg:hidden -bottom-1 right-4 sm:right-8 md:right-24 w-24 sm:w-32 md:w-40 h-16 sm:h-20 md:h-24 ${bgColor} rounded-t-full z-10`}></div>

                {/* Left Smooth Connector for the Hole */}
                <div className="absolute lg:hidden bottom-0 right-[7rem] sm:right-[10rem] md:right-[16rem] w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 z-10">
                    <div
                        className="w-full h-full bg-transparent rounded-br-[15px] sm:rounded-br-[20px] md:rounded-br-[25px]"
                        style={{
                            boxShadow: `15px 15px 0 0 ${bgColorHex}`
                        }}
                    />
                    {/* Larger shadows for bigger screens */}
                    <div
                        className="hidden sm:block w-full h-full bg-transparent rounded-br-[20px] absolute top-0 left-0"
                        style={{
                            boxShadow: `20px 20px 0 0 ${bgColorHex}`
                        }}
                    />
                    <div
                        className="hidden md:block w-full h-full bg-transparent rounded-br-[25px] absolute top-0 left-0"
                        style={{
                            boxShadow: `25px 25px 0 0 ${bgColorHex}`
                        }}
                    />
                </div>

                {/* Right Smooth Connector for the Hole */}
                <div className="lg:hidden absolute bottom-0 right-2 sm:right-4 md:right-12 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 z-10">
                    <div
                        className="w-full h-full bg-transparent rounded-bl-[15px] sm:rounded-bl-[20px] md:rounded-bl-[25px]"
                        style={{
                            boxShadow: `-15px 15px 0 0 ${bgColorHex}`
                        }}
                    />
                    {/* Larger shadows for bigger screens */}
                    <div
                        className="hidden sm:block w-full h-full bg-transparent rounded-bl-[20px] absolute top-0 left-0"
                        style={{
                            boxShadow: `-20px 20px 0 0 ${bgColorHex}`
                        }}
                    />
                    <div
                        className="hidden md:block w-full h-full bg-transparent rounded-bl-[25px] absolute top-0 left-0"
                        style={{
                            boxShadow: `-25px 25px 0 0 ${bgColorHex}`
                        }}
                    />
                </div>


                {/* ============================== 3. CARD CONTENT ============================== */}


                <div className="w-full me-10 sm:me-0 gap-8 h-full relative z-0 flex flex-col items-center justify-center p-1  sm:p-12 text-center">

                    <form
                        ref={searchRef}
                        onSubmit={handleSearch}
                        className='flex rounded-3xl mt-4 p-2  bg-[#49769F] sm:hidden items-center w-full relative'
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












                    {/* Text Content */}
                    <div className="mb-8 z-10 relative">
                        <h1 className="text-5xl sm:text-6xl md:text-8xl text-white font-light mb-2">
                            Discover Your Perfect
                        </h1>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl text-white font-medium">
                            Space
                        </h1>
                    </div>

                    {/* Image */}
                    {/* Using a mix-blend-mode or opacity can help integrate the image 
             if you want the background color to tint it, but here we just 
             display it cleanly with rounded corners.
          */}
                    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-inner">

                    </div>

                </div>

            </div>
        </div>
    );
};

export default InteriorCard;

