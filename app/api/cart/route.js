import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
    try {
        // Get token and verify user
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

        // Connect to database
        await connectDB();

        // Find cart and populate product details
        const cart = await Cart.findOne({ user: decoded.userId })
            .populate('items.product', 'name basePrice images category');

        if (!cart) {
            return NextResponse.json(
                {
                    success: true,
                    cart: {
                        items: [],
                        total: 0,
                    },
                },
                { status: 200 }
            );
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return NextResponse.json(
            {
                success: true,
                cart: {
                    items: cart.items,
                    total,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get cart error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
