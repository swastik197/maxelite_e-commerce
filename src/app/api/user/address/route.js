import { getUser } from "@/utils/authService";
import { connectDB } from "@/utils/dbconnect";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        if (!tokenCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = getUser(tokenCookie.value);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { street, city, state, postalCode, country } = await request.json();

        await connectDB(process.env.MONGO_URI);

        const userDoc = await User.findById(payload.id);
        if (!userDoc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update first address or push a new one
        const addressData = { street, city, state, postalCode, country };
        if (userDoc.address && userDoc.address.length > 0) {
            userDoc.address[0] = { ...userDoc.address[0].toObject(), ...addressData };
        } else {
            userDoc.address.push(addressData);
        }

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
