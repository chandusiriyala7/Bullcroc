import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all orders (admin only)
export async function GET(request) {
    try {
        // Verify admin
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.isAdmin) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, orders },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
