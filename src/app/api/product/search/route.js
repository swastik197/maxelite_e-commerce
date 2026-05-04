import { connectDB } from "@/utils/dbconnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ── route handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = Math.min(12, parseInt(searchParams.get("limit")) || 6);

    if (!query.trim()) {
        return NextResponse.json({ products: [] });
    }

    try {
        await connectDB(process.env.MONGO_URI);

        const normalizedQuery = query.trim();
        const slugBase = normalizedQuery.replace(/-\d+$/, "");
        const regex = new RegExp(normalizedQuery, "i");

        const products = await Product.find({
            $or: [
                { slug: normalizedQuery },
                { slug: slugBase },
                { name:        { $regex: regex } },
                { description: { $regex: regex } },
                { category:    { $regex: regex } },
                { brand:       { $regex: regex } },
                { tags:        { $regex: regex } },
            ],
        })
            .select("name description price salePrice isSale image rating category slug _id")
            .limit(limit)
            .lean();

        return NextResponse.json({ products, source: "db" });

    } catch (dbErr) {
        console.error("Search API error:", dbErr);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
