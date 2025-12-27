import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET single product
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { productId } = params;

        const product = await Product.findById(productId).populate('category');

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, product },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update product (admin only)
export async function PUT(request, { params }) {
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
        if (!decoded) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            );
        }

        await connectDB();

        // Verify admin role from DB
        const user = await User.findById(decoded._id);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 403 }
            );
        }

        const { productId } = params;
        const body = await request.json();

        await connectDB();

        const product = await Product.findByIdAndUpdate(
            productId,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Product updated successfully',
                product,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE product (admin only)
export async function DELETE(request, { params }) {
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
        if (!decoded) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            );
        }

        await connectDB();

        // Verify admin role from DB
        const user = await User.findById(decoded._id);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 403 }
            );
        }

        const { productId } = params;

        await connectDB();

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Product deleted successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
