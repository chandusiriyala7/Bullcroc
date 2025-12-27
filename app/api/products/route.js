import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Production Product Model (matching Bullcroc-Production backend)
const productSchema = new mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    price: Number,
    sellingPrice: Number,
    backgrounds: [String],
    presets: [String],
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const ProductModel = mongoose.models.product || mongoose.model('product', productSchema);

// GET all products from production database
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = {};
        if (category) {
            query.category = category;
        }

        const products = await ProductModel.find(query).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                message: 'All Products',
                success: true,
                error: false,
                data: products
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get products error:', error);
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
