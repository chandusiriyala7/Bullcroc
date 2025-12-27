import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { message: 'Please provide email', error: true, success: false },
                { status: 400 }
            );
        }
        if (!password) {
            return NextResponse.json(
                { message: 'Please provide password', error: true, success: false },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'User not found', error: true, success: false },
                { status: 404 }
            );
        }

        // Check password
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            // Create token
            const tokenData = {
                _id: user._id,
                email: user.email,
            };

            const token = jwt.sign(
                tokenData,
                process.env.JWT_SECRET || 'a3f1b2c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f678',
                { expiresIn: 60 * 60 * 8 } // 8 hours
            );

            // Remove password from response
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic
            };

            // Set cookie
            const response = NextResponse.json(
                {
                    message: 'Login successfully',
                    token: token,
                    user: userResponse,
                    success: true,
                    error: false
                },
                { status: 200 }
            );

            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 8 // 8 hours
            });

            return response;
        } else {
            return NextResponse.json(
                { message: 'Please check Password', error: true, success: false },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                message: error.message || error,
                error: true,
                success: false
            },
            { status: 500 }
        );
    }
}
