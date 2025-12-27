import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET single order
export async function GET(request, { params }) {
    try {
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

        await connectDB();
        const { orderId } = params;

        const order = await Order.findById(orderId)
            .populate('user', 'name email');

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, order },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update order status
export async function PUT(request, { params }) {
    try {
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

        const { orderId } = params;
        const { status } = await request.json();

        await connectDB();

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Order status updated',
                order,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
