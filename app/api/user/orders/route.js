import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET user's orders
export async function GET(request) {
    try {
        // Verify user
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            );
        }

        await connectDB();

        const orders = await Order.find({ user: decoded.userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, orders },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get user orders error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
