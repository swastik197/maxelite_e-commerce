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

        const { name, email, phone } = await request.json();

        await connectDB(process.env.MONGO_URI);

        const updatedUser = await User.findByIdAndUpdate(
            payload.id,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select('-password -profilepic');

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
                role: updatedUser.role,
                address: updatedUser.address || [],
            }
        });
    } catch (err) {
        console.log("Error updating profile:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
