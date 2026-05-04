import { connectDB } from "@/utils/dbconnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ── route handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const query     = searchParams.get("q")         || "";
    const slug      = searchParams.get("slug")      || "";
    const page      = Math.max(1, parseInt(searchParams.get("page"))  || 1);
    const limit     = Math.min(40, parseInt(searchParams.get("limit")) || 20);
    const sort      = searchParams.get("sort")      || "relevance";
    const minRating = parseFloat(searchParams.get("minRating")) || 0;
    const category  = searchParams.get("category")  || "";

    if (!query.trim() && !slug.trim()) {
        return NextResponse.json({ products: [], total: 0, page, pages: 0, source: "none" });
    }

    try {
        await connectDB(process.env.MONGO_URI);

        const normalizedQuery = query.trim();
        const normalizedSlug = slug.trim();
        const slugBase = normalizedSlug.replace(/-\d+$/, "");
        const regex = normalizedQuery ? new RegExp(normalizedQuery, "i") : null;

        const filter = {};

        if (normalizedSlug) {
            filter.$or = [
                { slug: normalizedSlug },
                { slug: slugBase },
            ];
        } else if (regex) {
            filter.$or = [
                { name:        { $regex: regex } },
                { description: { $regex: regex } },
                { category:    { $regex: regex } },
                { brand:       { $regex: regex } },
                { tags:        { $regex: regex } },
                { slug:        { $regex: regex } },
            ];
        }

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

        return NextResponse.json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit),
            query:  query.trim() || slug.trim(),
            source: "db",
        });

    } catch (dbErr) {
        console.error("Search result API error:", dbErr);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
