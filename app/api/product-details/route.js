import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET product details by ID
export async function POST(request) {
    try {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID required', error: true, success: false },
                { status: 400 }
            );
        }

        await connectDB();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found', error: true, success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: product,
                message: 'Product details',
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Get product details error:', error);
        return NextResponse.json(
            {
                message: error.message || error,
                error: true,
                success: false
            },
            { status: 400 }
        );
    }
}
