import { connectDB } from "@/utils/dbconnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";
import productsData from "@/config/products.json";

// ── JSON fallback search (suggestions) ───────────────────────────────────────
function searchLocalSuggestions(query) {
    const regex = new RegExp(query.trim(), "i");
    return productsData
        .filter(p =>
            regex.test(p.name        || "") ||
            regex.test(p.description || "") ||
            regex.test(p.category    || "") ||
            regex.test(p.brand       || "") ||
            (Array.isArray(p.tags) && p.tags.some(t => regex.test(t)))
        )
        .slice(0, 6)
        .map(p => ({
            _id:         p._id || p.id,
            name:        p.name,
            description: p.description,
            price:       p.salePrice && p.isSale ? p.salePrice : p.price,
            image:       p.image,
            rating:      parseFloat(p.rating) || 0,
            category:    p.category,
            slug:        p.slug,
        }));
}

// ── route handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
        return NextResponse.json({ products: [] });
    }

    // ── Try MongoDB first ─────────────────────────────────────────────────────
    try {
        await connectDB(process.env.MONGO_URI);

        const regex = new RegExp(query.trim(), "i");

        const products = await Product.find({
            $or: [
                { name:        { $regex: regex } },
                { description: { $regex: regex } },
                { category:    { $regex: regex } },
                { brand:       { $regex: regex } },
                { tags:        { $regex: regex } },
            ],
        })
            .select("name description price image rating category slug _id")
            .limit(6)
            .lean();

        // DB connected but no matches → try local JSON
        if (products.length === 0) {
            return NextResponse.json({ products: searchLocalSuggestions(query), source: "local" });
        }

        return NextResponse.json({ products, source: "db" });

    } catch (dbErr) {
        // ── DB unavailable → fall back to local JSON ──────────────────────────
        console.warn("Search API: DB unavailable, using local fallback.", dbErr.message);

        try {
            const products = searchLocalSuggestions(query);
            return NextResponse.json({ products, source: "local" });
        } catch (fallbackErr) {
            console.error("Search API fallback error:", fallbackErr);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
}
