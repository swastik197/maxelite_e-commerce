import { getUser } from "@/utils/authService";
import { connectDB } from "@/utils/dbconnect";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper to authenticate and return user doc
async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    if (!tokenCookie) return null;
    const payload = getUser(tokenCookie.value);
    if (!payload) return null;
    await connectDB(process.env.MONGO_URI);
    const userDoc = await User.findById(payload.id);
    return userDoc || null;
}

// POST – add a new address
export async function POST(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { street, city, state, postalCode, country } = await request.json();

        // Always push a new address entry
        userDoc.address.push({ street, city, state, postalCode, country });
        await userDoc.save();

        return NextResponse.json({
            message: "Address added successfully",
            address: userDoc.address
        });
    } catch (err) {
        console.log("Error adding address:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT – update an existing address by index (?index=0)
export async function PUT(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const index = parseInt(searchParams.get("index"));
        const { street, city, state, postalCode, country } = await request.json();

        if (isNaN(index) || index < 0 || index >= userDoc.address.length) {
            return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
        }

        userDoc.address[index] = { street, city, state, postalCode, country };
        await userDoc.save();

        return NextResponse.json({
            message: "Address updated successfully",
            address: userDoc.address
        });
    } catch (err) {
        console.log("Error updating address:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE – remove an address by index (?index=0)
export async function DELETE(request) {
    try {
        const userDoc = await getAuthenticatedUser();
        if (!userDoc) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const index = parseInt(searchParams.get("index"));

        if (isNaN(index) || index < 0 || index >= userDoc.address.length) {
            return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
        }

        userDoc.address.splice(index, 1);
        await userDoc.save();

        return NextResponse.json({
            message: "Address deleted successfully",
            address: userDoc.address
        });
    } catch (err) {
        console.log("Error deleting address:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



