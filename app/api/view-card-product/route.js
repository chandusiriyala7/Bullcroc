import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartProduct from '@/models/CartProduct';
import { getUserFromToken } from '@/lib/auth';

// GET - View cart products
export async function GET(request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json(
                { message: 'Not authenticated', error: true, success: false },
                { status: 401 }
            );
        }

        await connectDB();

        const allProduct = await CartProduct.find({
            userId: user._id
        }).populate('productId');

        return NextResponse.json(
            {
                data: allProduct,
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('View cart error:', error);
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
