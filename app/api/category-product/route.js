import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET category-wise products
export async function POST(request) {
    try {
        const { category } = await request.json();

        await connectDB();

        const products = await Product.find({ category }).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                data: products,
                message: 'Category products',
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Get category products error:', error);
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
