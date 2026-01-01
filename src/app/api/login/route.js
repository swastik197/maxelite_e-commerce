import { connectDB } from "@/utils/dbconnect";
import user from "@/models/userModel";
import jwt from "jsonwebtoken"
import { setUser } from "@/utils/authService";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB('mongodb://localhost:27017/rbac')
        const { email, password } = await request.json()
        
        const USER = await user.findOne({ email, password })
        if (USER) {
            const token = setUser(USER)
            if (token) {
                const response = NextResponse.json(
                    { message: 'user logged in successfully' },
                    { status: 200 }
                )
                
                response.cookies.set('token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 3600,
                    path: '/'
                })
                
                return response
            } else {
                console.log('unable to set the cookie for LOGIN')
                return NextResponse.json(
                    { error: 'Failed to generate token' },
                    { status: 500 }
                )
            }
        } else {
            return NextResponse.json(
                { error: 'incorrect email or password' },
                { status: 401 }
            )
        }
    } catch (err) {
        console.log('error occurred while login ', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}