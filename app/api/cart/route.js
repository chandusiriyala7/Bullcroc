import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
    try {
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

        // Fetch from CartProduct (unifying with CartPage logic)
        const cartItems = await CartProduct.find({ userId: decoded.userId })
            .populate('productId');

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            const price = item.price || item.productId?.sellingPrice || 0;
            return sum + (price * item.quantity);
        }, 0);

        return NextResponse.json(
            {
                success: true,
                cart: {
                    items: cartItems, // CartContext expects 'items'
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
