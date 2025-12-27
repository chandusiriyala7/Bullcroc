import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
import { getUserFromToken } from '@/lib/auth';

// POST - Update cart product quantity
export async function POST(request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json(
                { message: 'Not authenticated', error: true, success: false },
                { status: 401 }
            );
        }

        const { _id, quantity } = await request.json();

        await connectDB();

        const updateProduct = await CartProduct.updateOne(
            { _id },
            { quantity }
        );

        return NextResponse.json(
            {
                message: 'Product Updated',
                data: updateProduct,
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update cart error:', error);
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
