import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request) {
    try {
        await connectDB();

        let products = await Product.find({ isTopProduct: true }).sort({ createdAt: -1 });

        if (products.length === 0) {
            products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
        }

        return NextResponse.json(
            {
                data: products,
                message: 'Top products fetched successfully',
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Get top products error:', error);
        return NextResponse.json(
            {
                message: error.message || 'Failed to fetch top products',
                error: true,
                success: false
            },
            { status: 500 }
        );
    }
}
