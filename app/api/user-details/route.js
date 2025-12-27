import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json(
                { message: 'Not authenticated', error: true, success: false },
                { status: 401 }
            );
        }

        await connectDB();

        const userData = await User.findById(user._id).select('-password');

        if (!userData) {
            return NextResponse.json(
                { message: 'User not found', error: true, success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: userData,
                success: true,
                error: false,
                message: 'User details'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Get user details error:', error);
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
