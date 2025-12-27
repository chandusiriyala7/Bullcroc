import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
import { getUserFromToken } from '@/lib/auth';

// POST - Delete cart product
export async function POST(request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json(
                { message: 'Not authenticated', error: true, success: false },
                { status: 401 }
            );
        }

        const { _id } = await request.json();

        await connectDB();

        const deleteProduct = await CartProduct.deleteOne({ _id });

        return NextResponse.json(
            {
                message: 'Product Deleted From Cart',
                data: deleteProduct,
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete cart error:', error);
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
