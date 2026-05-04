"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

/* ─── Design tokens (match site palette) ─── */
const TEAL_DARK  = "#0f3c4c";
const TEAL_MID   = "#49769F";
const NAVY       = "#0A4174";

const sortOptions = [
    { label: "Relevance",           value: "relevance"  },
    { label: "Popularity",          value: "rating"     },
    { label: "Price: Low → High",   value: "price_low"  },
    { label: "Price: High → Low",   value: "price_high" },
    { label: "Newest First",        value: "newest"     },
];

const ratingFilters = [
    { stars: 4, label: "4★ & above" },
    { stars: 3, label: "3★ & above" },
    { stars: 2, label: "2★ & above" },
];

/* ─── Scroll-reveal hook ─── */
function useScrollReveal(threshold = 0.1) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

/* ─── Star row helper ─── */
function StarRow({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`h-3.5 w-3.5 ${i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

/* ─── Product card ─── */
function ProductCard({ product, wishlisted, onWishlist, index }) {
    const [cardRef, cardVisible] = useScrollReveal(0.05);
    const displayPrice  = product.isSale && product.salePrice ? product.salePrice : product.price;
    const originalPrice = product.price;
    const discountPct   = product.discountPercentage ||
        (product.isSale && originalPrice > 0
            ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
            : 0);

    return (
        <div
            ref={cardRef}
            style={{ transitionDelay: `${(index % 4) * 80}ms` }}
            className={`transition-all duration-700 ease-out ${cardVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"} `}
        >
            <Link
                href={`/product/${product.slug || product._id}`}
                className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 block"
            >
                {/* Image */}
                <div className="relative h-52 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">📦</div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/20 to-transparent" />

                    {/* Badges */}
                    {product.isSale && (
                        <span className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            SALE
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="absolute top-3 left-3 bg-gray-800/90 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full">
                            Out of Stock
                        </span>
                    )}

                    {/* Star rating pill */}
                    {product.rating > 0 && (
                        <div className="absolute bottom-2 left-2 bg-white rounded-xl px-2 py-1 flex items-center gap-1 shadow">
                            <StarRow rating={product.rating} />
                            <span className="text-xs text-gray-500 ml-0.5">({product.rating.toFixed(1)})</span>
                        </div>
                    )}

                    {/* Wishlist button */}
                    <button
                        onClick={(e) => { e.preventDefault(); onWishlist(product._id); }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-purple-100 hover:scale-110 transition-all duration-200 active:scale-90"
                    >
                        <svg className={`h-4 w-4 ${wishlisted ? "text-red-500 fill-current" : "text-gray-500"}`} fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                {/* Info */}
                <div className="p-3">
                    {product.category && (
                        <p className="text-xs text-purple-500 font-medium mb-1 uppercase tracking-wide">{product.category}</p>
                    )}
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-10 group-hover:text-purple-700 transition-colors duration-300">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-purple-600">₹{displayPrice.toLocaleString()}</span>
                            {discountPct > 0 && (
                                <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                        {discountPct > 0 && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{discountPct}% off</span>
                        )}
                    </div>
                    {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                        <p className="text-xs text-orange-500 font-medium mt-1">Only {product.stock} left!</p>
                    )}
                </div>
            </Link>
        </div>
    );
}

/* ─── Main Page ─── */
const ResultsPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    // Support both /results/[slug] and /results?q=...
    const query = decodeURIComponent(
        params.slug || searchParams.get("q") || ""
    );

    const [products, setProducts] = useState([]);
    const [total,    setTotal]    = useState(0);
    const [pages,    setPages]    = useState(1);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [wishlist, setWishlist] = useState([]);

    const [activeSort, setActiveSort] = useState("relevance");
    const [minRating,  setMinRating]  = useState(0);
    const [page,       setPage]       = useState(1);

    const LIMIT = 20;

    const fetchProducts = useCallback(async () => {
        if (!query) return;
        setLoading(true);
        setError(null);
        try {
            const url = new URL("/api/product/search/result", window.location.origin);
            url.searchParams.set("q",     query);
            url.searchParams.set("sort",  activeSort);
            url.searchParams.set("page",  page);
            url.searchParams.set("limit", LIMIT);
            if (minRating > 0) url.searchParams.set("minRating", minRating);

            const res  = await fetch(url.toString());
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch");

            setProducts(data.products || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [query, activeSort, page, minRating]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    useEffect(() => {
        const syncWishlist = async () => {
            try {
                const res = await fetch('/api/user/wishlist', { cache: 'no-store' });
                if (!res.ok) return;

                const data = await res.json();
                const wishlistItems = Array.isArray(data.wishlist) ? data.wishlist : [];
                setWishlist(wishlistItems.map((item) => String(item.id)));
            } catch {
                // Leave the current local state untouched if the user is not signed in.
            }
        };

        syncWishlist();
    }, []);

    const handleSort = (v) => { setActiveSort(v); setPage(1); };
    const handleRating = (s) => { setMinRating(p => p === s ? 0 : s); setPage(1); };
    const toggleWishlist = async (id) => {
        const shouldAdd = !wishlist.includes(id);
        const previousWishlist = wishlist;

        setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

        try {
            const res = await fetch('/api/user/wishlist', {
                method: shouldAdd ? 'POST' : 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update wishlist');

            setWishlist((Array.isArray(data.wishlist) ? data.wishlist : []).map((item) => String(item.id)));
        } catch {
            setWishlist(previousWishlist);
        }
    };

    // Page number list
    const pageNums = () => {
        const nums = []; const s = Math.max(1, page - 2); const e = Math.min(pages, page + 2);
        for (let i = s; i <= e; i++) nums.push(i);
        return nums;
    };

    const fromIdx = (page - 1) * LIMIT + 1;
    const toIdx   = Math.min(page * LIMIT, total);

    return (
        <div className="min-h-screen bg-gray-100 font-sans overflow-hidden">
            {/* ── Page header banner ── */}
            <div className="mx-1 mt-1 rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL_DARK} 0%, ${NAVY} 60%, #1a3a6e 100%)` }}>
                <div className="relative px-6 py-8">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-3">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            <span className="text-white/90">Search Results</span>
                        </nav>

                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Results for <span className="text-purple-300">"{query}"</span>
                        </h1>
                        {!loading && (
                            <p className="text-white/60 text-sm mt-1">
                                {total > 0 ? `${total.toLocaleString()} products found` : "No products found"}
                            </p>
                        )}

                        {/* Sort pills row */}
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                            <span className="text-white/60 text-xs font-medium mr-1">Sort by:</span>
                            {sortOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSort(opt.value)}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                                        activeSort === opt.value
                                            ? "bg-white text-purple-700 shadow"
                                            : "bg-white/10 text-white/80 hover:bg-white/20"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body layout ── */}
            <div className="flex gap-3 mx-1 mt-2">

                {/* ── Sidebar ── */}
                <aside className="hidden md:block w-56 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-4">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2" style={{ background: `linear-gradient(90deg, ${TEAL_MID}20, transparent)` }}>
                            <svg className="w-4 h-4 text-[#49769F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                            <h2 className="text-sm font-bold text-gray-800">Filters</h2>
                        </div>

                        {/* Clear filters */}
                        {(minRating > 0) && (
                            <div className="px-4 py-2 border-b border-gray-100">
                                <button
                                    onClick={() => { setMinRating(0); setPage(1); }}
                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Rating filter */}
                        <div className="px-4 py-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Customer Rating</h3>
                            <div className="space-y-2.5">
                                {ratingFilters.map(r => (
                                    <label key={r.stars} className="flex items-center gap-2.5 cursor-pointer group">
                                        <div
                                            onClick={() => handleRating(r.stars)}
                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                                                minRating === r.stars ? "bg-purple-600 border-purple-600" : "border-gray-300 group-hover:border-purple-400"
                                            }`}
                                        >
                                            {minRating === r.stars && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{r.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Main content ── */}
                <main className="flex-1 min-w-0">
                    {/* Mobile sort + filter strip */}
                    <div className="md:hidden bg-white rounded-2xl shadow-sm px-4 py-3 mb-3 flex items-center gap-2 overflow-x-auto">
                        {sortOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleSort(opt.value)}
                                className={`text-xs whitespace-nowrap font-medium px-3 py-1.5 rounded-full transition-all ${
                                    activeSort === opt.value ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Results count bar */}
                    {!loading && total > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm px-4 py-3 mb-3 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{fromIdx}–{toIdx}</span> of{" "}
                                <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> results
                            </p>
                            {minRating > 0 && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                    {minRating}★+ filter
                                    <button onClick={() => { setMinRating(0); setPage(1); }} className="ml-1 hover:text-purple-900">×</button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-48 bg-gray-200" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        <div className="h-4 bg-gray-200 rounded" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center gap-3 text-center">
                            <div className="text-5xl">⚠️</div>
                            <p className="text-gray-700 font-medium">{error}</p>
                            <button onClick={fetchProducts} className="mt-2 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && products.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: `${TEAL_MID}20` }}>🔍</div>
                            <h2 className="text-xl font-bold text-gray-800">No results found</h2>
                            <p className="text-gray-500 text-sm max-w-xs">
                                We couldn't find anything for <strong>"{query}"</strong>. Try different keywords or remove filters.
                            </p>
                            <Link href="/" className="mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${TEAL_DARK}, ${NAVY})` }}>
                                Back to Home
                            </Link>
                        </div>
                    )}

                    {/* Products grid */}
                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {products.map((product, i) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    index={i}
                                    wishlisted={wishlist.includes(product._id)}
                                    onWishlist={toggleWishlist}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && pages > 1 && (
                        <div className="mt-6 bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-center gap-2 flex-wrap">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Prev
                            </button>

                            {page > 3 && (
                                <>
                                    <button onClick={() => setPage(1)} className="w-9 h-9 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors">1</button>
                                    <span className="text-gray-400">…</span>
                                </>
                            )}

                            {pageNums().map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        n === page
                                            ? "text-white shadow-md shadow-purple-500/30 hover:-translate-y-0.5"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                    style={n === page ? { background: `linear-gradient(135deg, #7c3aed, #6d28d9)` } : {}}
                                >
                                    {n}
                                </button>
                            ))}

                            {page < pages - 2 && (
                                <>
                                    <span className="text-gray-400">…</span>
                                    <button onClick={() => setPage(pages)} className="w-9 h-9 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors">{pages}</button>
                                </>
                            )}

                            <button
                                onClick={() => setPage(p => Math.min(pages, p + 1))}
                                disabled={page === pages}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Bottom spacing */}
            <div className="h-8" />
        </div>
    );
};

export default ResultsPage;