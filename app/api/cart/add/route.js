import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request) {
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

        const { productId, quantity, customization, price } = await request.json();

        // Validation
        if (!productId || !quantity || !customization) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectDB();

        // Create new Cart Item (CartProduct)
        // We create a new entry every time for customized products to allow unique configurations
        const newCartItem = new CartProduct({
            userId: decoded.userId,
            productId: productId,
            quantity: quantity,
            customization: customization,
            price: price, // Store the custom price
            image: customization.previewImage || null // Lift image to top level if needed, or rely on customization.previewImage
        });

        await newCartItem.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Item added to cart',
                data: newCartItem
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
