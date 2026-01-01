import { connectDB } from "@/utils/dbconnect";
import user from "@/models/userModel";
import jwt from "jsonwebtoken"
import { setUser } from "@/utils/authService";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        await connectDB('mongodb://localhost:27017/rbac')
        const formData = await request.formData()
        const name = formData.get('name')
        const email = formData.get('email')
        const password = formData.get('password')

        const isExist = await user.findOne({ email })
        if (isExist) {
           console.log('user already exist')
                           return NextResponse.json(
                               { error: 'user already exist' },
                               { status: 400 }
                           )
        }
        const newUser = await user.create({ name, email, password })
        const token = setUser(newUser)
        if (token) {
            const response = NextResponse.json(
                                { message: 'user registered successfully' },
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
            console.log('unable to set the cookie for Register')
                return NextResponse.json(
                    { error: 'Failed to set cookie' },
                    { status: 500 })
        }

        
    } catch (err) {
        console.log('error occurred while register ', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}