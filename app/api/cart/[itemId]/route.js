import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function DELETE(request, { params }) {
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

        const { itemId } = params;

        // Connect to database
        await connectDB();

        // Find cart and remove item
        const cart = await Cart.findOne({ user: decoded.userId });

        if (!cart) {
            return NextResponse.json(
                { message: 'Cart not found' },
                { status: 404 }
            );
        }

        // Remove item
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Item removed from cart',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Remove from cart error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
