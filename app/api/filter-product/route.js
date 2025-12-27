import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// POST - Filter products by categories
export async function POST(request) {
    try {
        const { category } = await request.json();

        await connectDB();

        let query = {};
        if (category && category.length > 0) {
            query = {
                category: {
                    $in: category
                }
            };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                data: products,
                message: 'Filtered products',
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Filter products error:', error);
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
