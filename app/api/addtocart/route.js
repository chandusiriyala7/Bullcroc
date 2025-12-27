import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
import { getUserFromToken } from '@/lib/auth';

// POST - Add to cart
export async function POST(request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json(
                { message: 'Not authenticated', error: true, success: false },
                { status: 401 }
            );
        }

        const { productId } = await request.json();

        await connectDB();

        // Check if product already in cart
        const isProductAvailable = await CartProduct.findOne({
            productId,
            userId: user._id
        });

        if (isProductAvailable) {
            return NextResponse.json(
                {
                    message: 'Already exists in Add to cart',
                    success: false,
                    error: true
                },
                { status: 400 }
            );
        }

        // Add to cart
        const payload = {
            productId: productId,
            quantity: 1,
            userId: user._id,
        };

        const newAddToCart = new CartProduct(payload);
        const saveProduct = await newAddToCart.save();

        return NextResponse.json(
            {
                data: saveProduct,
                message: 'Product Added in Cart',
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Add to cart error:', error);
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
