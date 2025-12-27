import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET search products
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                { data: [], message: 'Search query required', success: true, error: false },
                { status: 200 }
            );
        }

        await connectDB();

        const searchRegex = new RegExp(query, 'i');

        const products = await Product.find({
            $or: [
                { productName: searchRegex },
                { category: searchRegex },
                { brandName: searchRegex }
            ]
        });

        return NextResponse.json(
            {
                data: products,
                message: 'Search results',
                success: true,
                error: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Search products error:', error);
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
