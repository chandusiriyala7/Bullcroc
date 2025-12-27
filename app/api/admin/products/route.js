import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all products (with optional filters)
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .populate('category')
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, products },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new product (admin only)
export async function POST(request) {
    try {
        // Verify admin
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.isAdmin) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            name,
            description,
            category,
            basePrice,
            images,
            customizationConfig,
        } = body;

        // Validation
        if (!name || !category || !basePrice) {
            return NextResponse.json(
                { message: 'Name, category, and base price are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Create product
        const product = await Product.create({
            name,
            description,
            category,
            basePrice,
            images: images || [],
            customizationConfig: customizationConfig || {},
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Product created successfully',
                product,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
