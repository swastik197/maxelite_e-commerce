import { getUser } from "@/utils/authService";
import { connectDB } from "@/utils/dbconnect";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function mapWishlist(userDoc) {
    return (userDoc.wishlist || []).map((product) => {
        const basePrice = Number(product.price || 0);
        const salePrice = Number(product.salePrice || 0);
        const isSaleActive = Boolean(product.isSale) && salePrice > 0;

        return {
            id: String(product._id),
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            image: product.image || "",
            category: product.category || "Unknown",
            rating: Number(product.rating || 0),
            inStock: Number(product.stock || 0) > 0,
            price: isSaleActive ? salePrice : basePrice,
            originalPrice: basePrice,
            addedAt: userDoc.updatedAt,
        };
    });
}

async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) return null;

    const payload = getUser(tokenCookie.value);
    if (!payload) return null;

    await connectDB(process.env.MONGO_URI);

    return User.findById(payload.id).populate({
        path: "wishlist",
        select: "name slug description price salePrice isSale image category rating stock",
    });
}

export async function GET() {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ wishlist: mapWishlist(userDoc) });
    } catch (err) {
        console.log("Error loading wishlist:", err);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}

export async function POST(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 });
        }

        const exists = await Product.findById(productId).select("_id").lean();
        if (!exists) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const alreadyInWishlist = userDoc.wishlist.some((entry) => String(entry._id || entry) === String(productId));
        if (!alreadyInWishlist) {
            userDoc.wishlist.push(productId);
            await userDoc.save();
        }

        await userDoc.populate({
            path: "wishlist",
            select: "name slug description price salePrice isSale image category rating stock",
        });

        return NextResponse.json({ message: "Wishlist updated", wishlist: mapWishlist(userDoc) });
    } catch (err) {
        console.log("Error adding to wishlist:", err);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}

export async function DELETE(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const { productId } = body;

        if (productId) {
            userDoc.wishlist = userDoc.wishlist.filter((entry) => String(entry._id || entry) !== String(productId));
        } else {
            userDoc.wishlist = [];
        }

        await userDoc.save();

        await userDoc.populate({
            path: "wishlist",
            select: "name slug description price salePrice isSale image category rating stock",
        });

        return NextResponse.json({ message: "Wishlist updated", wishlist: mapWishlist(userDoc) });
    } catch (err) {
        console.log("Error deleting wishlist item:", err);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}
