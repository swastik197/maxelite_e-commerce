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
// products now fetched from database via /api/product/search
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
const InteriorCard = () => {
    const cardColor = 'bg-[#0f3c4c]';
    const cardColorHex = '#001e3a';
    const bgColor = 'bg-white';
    const bgColorHex = '#FFFFFF';

    const [categorystat, setCategorystat] = useState(false)
    const [profilestat, setProfilestat] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [recentSearches, setRecentSearches] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const searchRef = useRef(null)
    const router = useRouter()

    const categories = categoriesData

    const Profiles = [
        { name: 'My Account', href: '/user_profile' },
        { name: 'Orders', href: '/user_profile' },
        { name: 'Wishlist', href: '/wishlist' },
    ]

    // Trigger entrance animations
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches')
        if (saved) setRecentSearches(JSON.parse(saved))
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            setSuggestions([])
            setSearchLoading(false)
            setSearchError(false)
            return
        }

        setSearchLoading(true)
        setSearchError(false)

        const debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/product/search?q=${encodeURIComponent(searchQuery.trim())}`)
                if (!res.ok) throw new Error('Search failed')
                const data = await res.json()
                setSuggestions(data.products || [])
            } catch (err) {
                console.error('Search error:', err)
                setSearchError(true)
                setSuggestions([])
            } finally {
                setSearchLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
            setRecentSearches(newRecent)
            localStorage.setItem('recentSearches', JSON.stringify(newRecent))
            router.push(`/results?q=${encodeURIComponent(searchQuery)}`)
            setSearchFocused(false)
        }
    }

    const handleSuggestionClick = (product) => {
        const newRecent = [product.name, ...recentSearches.filter(s => s !== product.name)].slice(0, 5)
        setRecentSearches(newRecent)
        localStorage.setItem('recentSearches', JSON.stringify(newRecent))
        if (product.slug) {
            router.push(`/product/${product.slug}`)
        } else {
            router.push(`/results?q=${encodeURIComponent(product.name)}`)
        }
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

    const trendingSearches = ['Modern Sofa', 'Oak Furniture', 'Bedroom Decor', 'Office Chair']

    return (
        <div className={`min-h-96 md:min-h-screen ${bgColor} overflow-hidden border-white flex items-center justify-center pb-6 lg:pb-0.5`}>
            <div className={`relative w-full max-w-screen h-full sm:h-screen ${cardColor} rounded-[0px] rounded-tl-none flex overflow-visible`}
                style={{
                    backgroundImage: "url('/main.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-[1]" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden z-[1] pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white/20 rounded-full animate-[floatParticle_8s_ease-in-out_infinite]" />
                    <div className="absolute top-[60%] left-[80%] w-3 h-3 bg-purple-300/15 rounded-full animate-[floatParticle_10s_ease-in-out_infinite_1s]" />
                    <div className="absolute top-[40%] left-[50%] w-1.5 h-1.5 bg-blue-300/20 rounded-full animate-[floatParticle_6s_ease-in-out_infinite_2s]" />
                    <div className="absolute top-[80%] left-[30%] w-2.5 h-2.5 bg-white/10 rounded-full animate-[floatParticle_12s_ease-in-out_infinite_0.5s]" />
                    <div className="absolute top-[15%] left-[70%] w-1 h-1 bg-purple-200/25 rounded-full animate-[floatParticle_9s_ease-in-out_infinite_3s]" />
                </div>

                <div className="  w-16 h-16 pointer-events-none overflow-hidden">

                </div>

                {/* Bottom cutouts */}
                <div className={`absolute lg:hidden -bottom-1 right-4 sm:right-8 md:right-24 w-24 sm:w-32 md:w-40 h-16 sm:h-20 md:h-24 ${bgColor} rounded-t-full z-10`}></div>
                <div className="absolute lg:hidden bottom-0 right-[7rem] sm:right-[10rem] md:right-[16rem] w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 z-10">
                    <div className="w-full h-full bg-transparent rounded-br-[15px] sm:rounded-br-[20px] md:rounded-br-[25px]" style={{ boxShadow: `15px 15px 0 0 ${bgColorHex}` }} />
                    <div className="hidden sm:block w-full h-full bg-transparent rounded-br-[20px] absolute top-0 left-0" style={{ boxShadow: `20px 20px 0 0 ${bgColorHex}` }} />
                    <div className="hidden md:block w-full h-full bg-transparent rounded-br-[25px] absolute top-0 left-0" style={{ boxShadow: `25px 25px 0 0 ${bgColorHex}` }} />
                </div>
                <div className="lg:hidden absolute bottom-0 right-2 sm:right-4 md:right-12 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 z-10">
                    <div className="w-full h-full bg-transparent rounded-bl-[15px] sm:rounded-bl-[20px] md:rounded-bl-[25px]" style={{ boxShadow: `-15px 15px 0 0 ${bgColorHex}` }} />
                    <div className="hidden sm:block w-full h-full bg-transparent rounded-bl-[20px] absolute top-0 left-0" style={{ boxShadow: `-20px 20px 0 0 ${bgColorHex}` }} />
                    <div className="hidden md:block w-full h-full bg-transparent rounded-bl-[25px] absolute top-0 left-0" style={{ boxShadow: `-25px 25px 0 0 ${bgColorHex}` }} />
                </div>
                <div className='w-[100px] h-[100px] absolute hidden lg:flex m-12 bottom-0 right-0 bg-white rounded-full items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 group'>
                    <svg viewBox="0 0 100 100" className="absolute w-[140px] h-[140px] animate-[spin_10s_linear_infinite] overflow-visible pointer-events-none">
                        <defs>
                            <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                        </defs>
                        <text>
                            <textPath href="#circlePath" startOffset="0%" className="text-[10px] font-bold fill-white tracking-[0.27em] uppercase">
                                Explore Now • Explore Now •
                            </textPath>
                        </text>
                    </svg>
                    <ArrowOutwardIcon sx={{ fontSize: 44 }} className='text-[#0f3c4c] z-10 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300' />
                </div>

                <div className='w-[80px] h-[80px] absolute flex md:hidden right-6 -bottom-6 z-[80] bg-black rounded-full items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 group'>
                    <svg viewBox="0 0 100 100" className="absolute w-[140px] h-[140px] animate-[spin_10s_linear_infinite] overflow-visible pointer-events-none">
                        <defs>
                            <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                        </defs>
                        <text>
                            <textPath href="#circlePath" startOffset="0%" className="text-[8px] z-[0px] font-bold fill-white tracking-[0.2em] uppercase">
                                Explore Now • Explore Now •
                            </textPath>
                        </text>
                    </svg>
                    <ArrowOutwardIcon sx={{ fontSize: 44 }} className='text-white z-10 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300' />
                </div>



                {/* ============================== CARD CONTENT ============================== */}
                <div className="w-full me-10 sm:me-0 gap-8 h-full relative z-[2] flex flex-col items-center justify-center p-1 sm:p-12 text-center">

                    {/* Mobile search bar */}
                    <form
                        ref={searchRef}
                        onSubmit={handleSearch}
                        className={`flex rounded-3xl mt-24 p-2 bg-[#49769F] sm:hidden items-center w-full relative z-50 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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

                        {searchFocused && (
                            <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto z-[100] animate-[fadeInDown_0.25s_ease-out]'>
                                {searchLoading && (
                                    <div className='p-4 flex items-center justify-center gap-2 text-gray-500'>
                                        <div className='w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin' />
                                        <span className='text-sm'>Searching...</span>
                                    </div>
                                )}
                                {searchError && (
                                    <div className='p-4 text-center text-red-500 text-sm'>Something went wrong. Try again.</div>
                                )}
                                {!searchLoading && !searchError && suggestions.length > 0 && (
                                    <div className='p-3'>
                                        <p className='text-xs font-semibold text-gray-500 uppercase mb-2 px-2'>Products</p>
                                        {suggestions.map((product) => (
                                            <div key={product._id || product.id} onClick={() => handleSuggestionClick(product)}
                                                className='flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors'>
                                                <img src={product.image} alt={product.name} className='w-12 h-12 object-cover rounded-lg bg-gray-100' />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-gray-800 font-medium truncate'>{product.name}</p>
                                                    <p className='text-purple-600 font-semibold text-sm'>${product.price}</p>
                                                </div>
                                                {product.rating && (
                                                    <div className='flex items-center gap-1 text-yellow-500'>
                                                        <span className='text-sm'>★</span>
                                                        <span className='text-gray-600 text-sm'>{product.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchQuery.trim() && !searchLoading && !searchError && suggestions.length === 0 && (
                                    <div className='p-6 text-center text-gray-500'>
                                        <p>No products found for &quot;{searchQuery}&quot;</p>
                                        <p className='text-sm mt-1'>Try a different search term</p>
                                    </div>
                                )}
                                {!searchQuery.trim() && recentSearches.length > 0 && (
                                    <div className='p-3 border-b'>
                                        <div className='flex items-center justify-between px-2 mb-2'>
                                            <p className='text-xs font-semibold text-gray-500 uppercase'>Recent Searches</p>
                                            <button onClick={clearRecentSearches} className='text-xs text-purple-600 hover:text-purple-700'>Clear All</button>
                                        </div>
                                        {recentSearches.map((search, index) => (
                                            <div key={index} onClick={() => handleRecentSearchClick(search)}
                                                className='flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors group'>
                                                <div className='flex items-center gap-2'>
                                                    <HistoryIcon className='w-4 h-4 text-gray-400' />
                                                    <span className='text-gray-700'>{search}</span>
                                                </div>
                                                <button onClick={(e) => removeRecentSearch(search, e)} className='opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all'>
                                                    <CloseIcon className='w-4 h-4 text-gray-400' />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!searchQuery.trim() && (
                                    <div className='p-3'>
                                        <p className='text-xs font-semibold text-gray-500 uppercase mb-2 px-2 flex items-center gap-1'>
                                            <TrendingUpIcon className='w-4 h-4' /> Trending Searches
                                        </p>
                                        <div className='flex flex-wrap gap-2 px-2'>
                                            {trendingSearches.map((search, index) => (
                                                <button key={index} onClick={() => { setSearchQuery(search); handleRecentSearchClick(search) }}
                                                    className='px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 rounded-full text-sm transition-colors'>
                                                    {search}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!searchQuery.trim() && (
                                    <div className='p-3 border-t'>
                                        <p className='text-xs font-semibold text-gray-500 uppercase mb-2 px-2'>Categories</p>
                                        <div className='grid grid-cols-2 gap-1'>
                                            {categories.slice(0, 4).map((category) => (
                                                <Link key={category.id} href={`/category?slug=${category.slug}`} onClick={() => setSearchFocused(false)}
                                                    className='p-2 hover:bg-purple-50 rounded-lg text-gray-700 text-sm transition-colors'>
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>

                    {/* Text Content with staggered reveal */}
                    <div className="mb-8 z-1 relative">
                        <h1 className={`text-5xl sm:text-6xl md:text-8xl text-white font-light mb-2 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            Discover Your Perfect
                        </h1>
                        <h1 className={`text-5xl sm:text-6xl md:text-8xl text-white font-medium transition-all duration-1000 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            Space
                        </h1>


                    </div>

                    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-inner">
                    </div>
                </div>
            </div>

            {/* Keyframe animations */}
            <style jsx global>{`
                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
                    25% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
                    50% { transform: translateY(-15px) translateX(-10px); opacity: 0.4; }
                    75% { transform: translateY(-40px) translateX(5px); opacity: 0.7; }
                }
                @keyframes fadeInDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default InteriorCard;
