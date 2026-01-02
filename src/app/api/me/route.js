import { getUser } from "@/utils/authService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token")
    if (!tokenCookie) {
        return NextResponse.json({ user: null }, { status: 401 });
    } else {
        try {
            const payload = getUser(tokenCookie.value)
            return NextResponse.json({ user: payload });
        } catch (err) {

            return NextResponse.json({ user: null }, { status: 401 });
        }

    }

}