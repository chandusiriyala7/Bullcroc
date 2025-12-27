import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ suggestions: [] }, { status: 200 });
        }

        await connectDB();

        const searchRegex = new RegExp(query, 'i');

        // Fetch top 5 matches
        const products = await Product.find({
            $or: [
                { productName: searchRegex },
                { category: searchRegex },
                { name: searchRegex } // Handle potential field name variations
            ]
        })
            .select('name productName category productImage price sellingPrice slug') // Select only necessary fields
            .limit(5);

        // Normalize product name since we might have name or productName field
        const suggestions = products.map(p => ({
            _id: p._id,
            name: p.name || p.productName,
            category: p.category,
            price: p.sellingPrice || p.price,
            image: p.productImage?.[0] || '',
            slug: p._id // Using ID for navigation if slug not available
        }));

        return NextResponse.json(
            { suggestions, success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error('Search suggest error:', error);
        return NextResponse.json(
            { message: 'Internal server error', suggestions: [] },
            { status: 500 }
        );
    }
}
