"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "UGAOO Variegated Money Plant",
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop",
        pack: "Pack of 1",
        rating: 4.4,
        reviews: 1785,
        assured: true,
        price: 299,
        originalPrice: 445,
        discount: 32,
        sponsored: true,
        stock: "in_stock"
    },
    {
        id: 2,
        name: "KrishnaNursery Golden Money Plant, Fittonia plant, Jade...",
        image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=300&h=300&fit=crop",
        pack: "Pack of 4",
        rating: 4.2,
        reviews: 892,
        assured: true,
        price: 933,
        originalPrice: 1399,
        discount: 33,
        sponsored: false,
        stock: "few_left"
    },
    {
        id: 3,
        name: "KrishnaNursery Fittonia plant, Jade Plant, Variegated M...",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop",
        pack: "Pack of 4",
        rating: 4.3,
        reviews: 1205,
        assured: true,
        price: 933,
        originalPrice: 1399,
        discount: 33,
        sponsored: false,
        stock: "few_left"
    },
    {
        id: 4,
        name: "KrishnaNursery Jade Plant, Variegated Money Plant, Fitt...",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop",
        pack: "Pack of 4",
        rating: 4.1,
        reviews: 756,
        assured: true,
        price: 933,
        originalPrice: 1399,
        discount: 33,
        sponsored: false,
        stock: "in_stock"
    },
    {
        id: 5,
        name: "Indoor Snake Plant with Ceramic Pot",
        image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=300&h=300&fit=crop",
        pack: "Pack of 1",
        rating: 4.5,
        reviews: 2341,
        assured: true,
        price: 449,
        originalPrice: 699,
        discount: 36,
        sponsored: false,
        stock: "in_stock"
    },
    {
        id: 6,
        name: "Peace Lily Air Purifying Plant",
        image: "https://images.unsplash.com/photo-1598880940371-c756e015faf1?w=300&h=300&fit=crop",
        pack: "Pack of 1",
        rating: 4.6,
        reviews: 1567,
        assured: true,
        price: 599,
        originalPrice: 899,
        discount: 33,
        sponsored: true,
        stock: "few_left"
    },
    {
        id: 7,
        name: "Bamboo Palm Indoor Plant with Pot",
        image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=300&h=300&fit=crop",
        pack: "Pack of 1",
        rating: 4.3,
        reviews: 987,
        assured: false,
        price: 799,
        originalPrice: 1199,
        discount: 33,
        sponsored: false,
        stock: "in_stock"
    },
    {
        id: 8,
        name: "Areca Palm Natural Air Purifier",
        image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&h=300&fit=crop",
        pack: "Pack of 2",
        rating: 4.4,
        reviews: 1123,
        assured: true,
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        sponsored: false,
        stock: "in_stock"
    }
];

const categories = [
    { name: "Home Improvement", hasParent: true },
    { name: "Lawn and Gardening", hasParent: true },
    { name: "Plants and Planters", hasParent: true },
    { name: "Plants Saplings", hasParent: false }
];

const filterSections = [
    {
        title: "TYPE",
        options: ["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Succulents"],
        expandable: true
    },
    {
        title: "PLANT NAME",
        options: ["Money Plant", "Snake Plant", "Jade Plant", "Fittonia", "Peace Lily"],
        expandable: true
    },
    {
        title: "SUITABLE LOCATION",
        options: ["Living Room", "Bedroom", "Balcony", "Office", "Bathroom"],
        expandable: true
    }
];

const ratings = [
    { stars: 4, label: "4★ & above" },
    { stars: 3, label: "3★ & above" },
    { stars: 2, label: "2★ & above" },
    { stars: 1, label: "1★ & above" }
];

const packOptions = ["Pack of 1", "Pack of 2", "Pack of 3", "Pack of 4", "Pack of 5+"];

const sortOptions = [
    { label: "Relevance", value: "relevance" },
    { label: "Popularity", value: "popularity" },
    { label: "Price -- Low to High", value: "price_low" },
    { label: "Price -- High to Low", value: "price_high" },
    { label: "Newest First", value: "newest" }
];

const ResultsPage = () => {
    const [activeSort, setActiveSort] = useState("relevance");
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedPacks, setSelectedPacks] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});
    const [wishlist, setWishlist] = useState([]);

    const toggleSection = (title) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const toggleRating = (stars) => {
        setSelectedRatings(prev =>
            prev.includes(stars)
                ? prev.filter(r => r !== stars)
                : [...prev, stars]
        );
    };

    const togglePack = (pack) => {
        setSelectedPacks(prev =>
            prev.includes(pack)
                ? prev.filter(p => p !== pack)
                : [...prev, pack]
        );
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Container */}
            <div className="flex max-w-[1600px] mx-auto">

                {/* Left Sidebar - Filters */}
                <aside className="w-[280px] min-w-[280px] bg-white border-r border-gray-200 min-h-screen sticky top-0 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                    </div>

                    {/* Categories */}
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wide">CATEGORIES</h3>
                        <ul className="space-y-2">
                            {categories.map((category, index) => (
                                <li key={index}>
                                    <Link
                                        href="#"
                                        className={`text-sm hover:text-blue-600 flex items-center gap-1 ${category.hasParent ? 'text-gray-600' : 'text-gray-800 font-medium'
                                            }`}
                                    >
                                        {category.hasParent && (
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        )}
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collapsible Filter Sections */}
                    {filterSections.map((section, idx) => (
                        <div key={idx} className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <h3 className="text-xs font-bold text-gray-500 tracking-wide">{section.title}</h3>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections[section.title] ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedSections[section.title] && (
                                <div className="px-4 pb-4 space-y-2">
                                    {section.options.map((option, optIdx) => (
                                        <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                                            <span className="text-sm text-gray-600">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Customer Ratings */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('CUSTOMER RATINGS')}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                        >
                            <h3 className="text-xs font-bold text-gray-500 tracking-wide">CUSTOMER RATINGS</h3>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections['CUSTOMER RATINGS'] ? '' : 'rotate-180'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className="px-4 pb-4 space-y-2">
                            {ratings.map((rating, idx) => (
                                <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRatings.includes(rating.stars)}
                                        onChange={() => toggleRating(rating.stars)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-600">{rating.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Pack Of */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('PACK OF')}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                        >
                            <h3 className="text-xs font-bold text-gray-500 tracking-wide">PACK OF</h3>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections['PACK OF'] ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {expandedSections['PACK OF'] && (
                            <div className="px-4 pb-4 space-y-2">
                                {packOptions.map((pack, idx) => (
                                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedPacks.includes(pack)}
                                            onChange={() => togglePack(pack)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600">{pack}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Content - Products */}
                <main className="flex-1 bg-white">
                    {/* Breadcrumb */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-white">
                        <nav className="flex items-center gap-2 text-xs text-gray-500">
                            <Link href="/" className="hover:text-blue-600">Home</Link>
                            <span>&gt;</span>
                            <Link href="#" className="hover:text-blue-600">Home Impro...</Link>
                            <span>&gt;</span>
                            <Link href="#" className="hover:text-blue-600">Lawn and G...</Link>
                            <span>&gt;</span>
                            <Link href="#" className="hover:text-blue-600">Plants and Pl...</Link>
                            <span>&gt;</span>
                            <span className="text-gray-700">Plants Saplin...</span>
                        </nav>
                    </div>

                    {/* Results Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1 – 40</span> of <span className="font-medium">21,817</span> results for "<span className="font-medium">indoor plant</span>"
                            </p>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-6 mt-3">
                            <span className="text-sm font-medium text-gray-700">Sort By</span>
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setActiveSort(option.value)}
                                    className={`text-sm font-medium transition-colors ${activeSort === option.value
                                            ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                                            : 'text-gray-600 hover:text-blue-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                        {sampleProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border-r border-b border-gray-200 bg-blue-000 p-2 m-1 rounded-xl hover:shadow-lg transition-shadow cursor-pointer relative group"
                            >
                                {/* Wishlist Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(product.id);
                                    }}
                                    className="absolute top-4 right-4 z-10 p-1"
                                >
                                    <svg
                                        className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                                        fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                {/* Product Image */}
                                <div className="relative h-52 mb-4 flex items-center justify-center bg-gray-50 rounded">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-full max-w-full object-contain rounded"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    {/* Sponsored Tag */}
                                    {product.sponsored && (
                                        <span className="text-xs text-gray-400">Sponsored</span>
                                    )}

                                    {/* Product Name */}
                                    <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px]">
                                        {product.name}
                                    </h3>

                                    {/* Pack Info */}
                                    <p className="text-xs text-gray-500">{product.pack}</p>

                                    {/* Rating & Assured */}
                                    <div className="flex items-center gap-2">
                                        <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            {product.rating}
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </span>
                                        <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                                        {product.assured && (
                                            <div className="flex items-center gap-0.5">
                                                <div className="bg-blue-600 rounded-full p-0.5">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-semibold text-blue-600">Assured</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-lg font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        <span className="text-sm text-green-600 font-medium">{product.discount}% off</span>
                                    </div>

                                    {/* Stock Status */}
                                    {product.stock === "few_left" && (
                                        <p className="text-xs text-red-500 font-medium">Only few left</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-200">
                        <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">4</button>
                        <span className="text-gray-400">...</span>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">546</button>
                        <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700">
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResultsPage;