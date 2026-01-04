import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
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

        // Find the cart item
        const cartItem = await CartProduct.findOne({ _id: itemId });

        if (!cartItem) {
            return NextResponse.json(
                { message: 'Item not found' },
                { status: 404 }
            );
        }

        // Verify ownership
        if (cartItem.userId.toString() !== decoded._id.toString()) {
            return NextResponse.json(
                { message: 'Not authorized to remove this item' },
                { status: 403 }
            );
        }

        // Remove item using findByIdAndDelete
        await CartProduct.findByIdAndDelete(itemId);

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
