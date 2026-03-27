import { connectDB } from "@/utils/dbconnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";
import productsData from "@/config/products.json";

// ── helpers ──────────────────────────────────────────────────────────────────
function matchesQuery(product, regex) {
    return (
        regex.test(product.name        || "") ||
        regex.test(product.description || "") ||
        regex.test(product.category    || "") ||
        regex.test(product.brand       || "") ||
        (Array.isArray(product.tags) && product.tags.some(t => regex.test(t)))
    );
}

function searchLocalFallback({ query, sort, page, limit, minRating, category }) {
    const regex = new RegExp(query.trim(), "i");

    let results = productsData.filter(p => {
        if (!matchesQuery(p, regex)) return false;
        if (minRating > 0 && (parseFloat(p.rating) || 0) < minRating) return false;
        if (category && !new RegExp(category.trim(), "i").test(p.category || "")) return false;
        return true;
    });

    // Sort
    switch (sort) {
        case "price_low":  results.sort((a, b) => a.price - b.price);                    break;
        case "price_high": results.sort((a, b) => b.price - a.price);                    break;
        case "rating":     results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)); break;
        case "newest":     results.sort((a, b) => b._id.localeCompare(a._id));           break;
    }

    const total = results.length;
    const skip  = (page - 1) * limit;
    const paged = results.slice(skip, skip + limit);

    return { products: paged, total, page, pages: Math.ceil(total / limit) };
}

// ── route handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const query     = searchParams.get("q")         || "";
    const page      = Math.max(1, parseInt(searchParams.get("page"))  || 1);
    const limit     = Math.min(40, parseInt(searchParams.get("limit")) || 20);
    const sort      = searchParams.get("sort")      || "relevance";
    const minRating = parseFloat(searchParams.get("minRating")) || 0;
    const category  = searchParams.get("category")  || "";

    if (!query.trim()) {
        return NextResponse.json({ products: [], total: 0, page, pages: 0, source: "none" });
    }

    // ── Try MongoDB first ─────────────────────────────────────────────────────
    try {
        await connectDB(process.env.MONGO_URI);

        const regex = new RegExp(query.trim(), "i");
        const filter = {
            $or: [
                { name:        { $regex: regex } },
                { description: { $regex: regex } },
                { category:    { $regex: regex } },
                { brand:       { $regex: regex } },
                { tags:        { $regex: regex } },
            ],
        };

        if (minRating > 0) filter.rating = { $gte: minRating };
        if (category)      filter.category = new RegExp(category.trim(), "i");

        let sortObj = {};
        switch (sort) {
            case "price_low":  sortObj = { price: 1 };    break;
            case "price_high": sortObj = { price: -1 };   break;
            case "rating":     sortObj = { rating: -1 };  break;
            case "newest":     sortObj = { _id: -1 };     break;
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .select("name description price salePrice isSale discountPercentage image rating numReviews category brand slug stock _id")
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        // If DB connected but returned nothing, fall back to local JSON
        if (products.length === 0) {
            const localResult = searchLocalFallback({ query, sort, page, limit, minRating, category });
            if (localResult.products.length > 0) {
                return NextResponse.json({ ...localResult, query: query.trim(), source: "local" });
            }
        }

        return NextResponse.json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit),
            query:  query.trim(),
            source: "db",
        });

    } catch (dbErr) {
        // ── DB unavailable → fall back to local JSON ──────────────────────────
        console.warn("Search result API: DB unavailable, using local fallback.", dbErr.message);

        try {
            const result = searchLocalFallback({ query, sort, page, limit, minRating, category });
            return NextResponse.json({ ...result, query: query.trim(), source: "local" });
        } catch (fallbackErr) {
            console.error("Search result API fallback error:", fallbackErr);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
}
