import { getUser } from "@/utils/authService";
import { connectDB } from "@/utils/dbconnect";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getEntryProductId(entry) {
    return String(entry?.product?._id || entry?.product || "");
}

function mapCart(userDoc) {
    const wishlistSet = new Set((userDoc.wishlist || []).map((item) => String(item._id || item)));

    return (userDoc.cart || [])
        .filter((entry) => entry.product)
        .map((entry) => {
            const product = entry.product;
            const productId = String(product._id);
            const basePrice = Number(product.price || 0);
            const salePrice = Number(product.salePrice || 0);
            const isSaleActive = Boolean(product.isSale) && salePrice > 0;

            return {
                id: productId,
                name: product.name || "",
                slug: product.slug || "",
                description: product.description || "",
                image: product.image || "",
                category: product.category || "Unknown",
                rating: Number(product.rating || 0),
                inStock: Number(product.stock || 0) > 0,
                price: isSaleActive ? salePrice : basePrice,
                originalPrice: basePrice,
                quantity: Number(entry.quantity || 1),
                isWishlisted: wishlistSet.has(productId),
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

    return User.findById(payload.id)
        .populate({
            path: "cart.product",
            select: "name slug description price salePrice isSale image category rating stock",
        })
        .populate({ path: "wishlist", select: "_id" });
}

export async function GET() {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ cart: mapCart(userDoc) });
    } catch (err) {
        console.log("Error loading cart:", err);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}

export async function POST(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, productIds, quantity } = await request.json();

        const idsToAdd = Array.isArray(productIds)
            ? productIds.filter(Boolean)
            : productId
                ? [productId]
                : [];

        if (idsToAdd.length === 0) {
            return NextResponse.json({ error: "productId or productIds is required" }, { status: 400 });
        }

        const products = await Product.find({ _id: { $in: idsToAdd } }).select("_id").lean();
        const validIds = new Set(products.map((p) => String(p._id)));

        if (validIds.size === 0) {
            return NextResponse.json({ error: "No valid products found" }, { status: 404 });
        }

        const qtyToAdd = Math.max(1, Number(quantity || 1));

        for (const id of idsToAdd) {
            if (!validIds.has(String(id))) continue;

            const existing = userDoc.cart.find((entry) => getEntryProductId(entry) === String(id));
            if (existing) {
                existing.quantity += qtyToAdd;
            } else {
                userDoc.cart.push({ product: id, quantity: qtyToAdd });
            }
        }

        await userDoc.save();

        await userDoc.populate({
            path: "cart.product",
            select: "name slug description price salePrice isSale image category rating stock",
        });
        await userDoc.populate({ path: "wishlist", select: "_id" });

        return NextResponse.json({ message: "Cart updated", cart: mapCart(userDoc) });
    } catch (err) {
        console.log("Error adding to cart:", err);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}

export async function PUT(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, quantity } = await request.json();
        const nextQty = Number(quantity);

        if (!productId || !Number.isFinite(nextQty) || nextQty < 1) {
            return NextResponse.json({ error: "Valid productId and quantity are required" }, { status: 400 });
        }

        const index = userDoc.cart.findIndex((entry) => getEntryProductId(entry) === String(productId));
        if (index === -1) {
            return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
        }

        userDoc.cart[index].quantity = nextQty;
        await userDoc.save();

        await userDoc.populate({
            path: "cart.product",
            select: "name slug description price salePrice isSale image category rating stock",
        });
        await userDoc.populate({ path: "wishlist", select: "_id" });

        return NextResponse.json({ message: "Cart updated", cart: mapCart(userDoc) });
    } catch (err) {
        console.log("Error updating cart quantity:", err);
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
            userDoc.cart = userDoc.cart.filter((entry) => getEntryProductId(entry) !== String(productId));
        } else {
            userDoc.cart = [];
        }

        await userDoc.save();

        await userDoc.populate({
            path: "cart.product",
            select: "name slug description price salePrice isSale image category rating stock",
        });
        await userDoc.populate({ path: "wishlist", select: "_id" });

        return NextResponse.json({ message: "Cart updated", cart: mapCart(userDoc) });
    } catch (err) {
        console.log("Error deleting cart item:", err);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}
