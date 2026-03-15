import { getUser } from "@/utils/authService";
import { connectDB } from "@/utils/dbconnect";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token")
    if (!tokenCookie) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
    try {
        const payload = getUser(tokenCookie.value)
        if (!payload) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Connect to DB and fetch full user data
        await connectDB(process.env.MONGO_URI)
        const fullUser = await User.findById(payload.id).select('-password')

        if (!fullUser) {
            return NextResponse.json({ user: payload }); // fallback to JWT payload
        }

        // Convert profilepic buffer to base64 data URL if it exists
        let profilepicUrl = null;
        if (fullUser.profilepic) {
            const base64 = fullUser.profilepic.toString('base64');
            profilepicUrl = `data:image/jpeg;base64,${base64}`;
        }

        return NextResponse.json({
            user: {
                id: fullUser._id,
                name: fullUser.name,
                email: fullUser.email,
                phone: fullUser.phone || '',
                role: fullUser.role,
                address: fullUser.address || [],
                profilepic: profilepicUrl,
                createdAt: fullUser.createdAt,
            }
        });
    } catch (err) {
        console.log('Error in /api/me:', err)
        return NextResponse.json({ user: null }, { status: 401 });
    }
}