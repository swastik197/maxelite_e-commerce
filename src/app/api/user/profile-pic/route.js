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

        const formData = await request.formData();
        const file = formData.get("profilepic");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Maximum 5MB allowed." }, { status: 400 });
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await connectDB(process.env.MONGO_URI);

        const updatedUser = await User.findByIdAndUpdate(
            payload.id,
            { profilepic: buffer },
            { new: true }
        ).select('profilepic');

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return the new profile pic as base64 data URL
        const base64 = buffer.toString('base64');
        const mimeType = file.type;
        const profilepicUrl = `data:${mimeType};base64,${base64}`;

        return NextResponse.json({
            message: "Profile picture updated successfully",
            profilepic: profilepicUrl
        });
    } catch (err) {
        console.log("Error uploading profile pic:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
