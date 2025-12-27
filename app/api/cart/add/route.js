import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request) {
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

        const { productId, quantity, customization, price } = await request.json();

        // Validation
        if (!productId || !quantity || !customization || !price) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find or create cart
        let cart = await Cart.findOne({ user: decoded.userId });

        if (!cart) {
            cart = new Cart({
                user: decoded.userId,
                items: [],
            });
        }

        // Add item to cart
        cart.items.push({
            product: productId,
            quantity,
            customization,
            price,
        });

        await cart.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Item added to cart',
                cart: {
                    itemCount: cart.items.length,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
