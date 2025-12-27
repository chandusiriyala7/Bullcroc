import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// POST create order
export async function POST(request) {
    try {
        // Verify user
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

        const { shippingAddress } = await request.json();

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
            return NextResponse.json(
                { message: 'Shipping address is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Get user's cart
        const cart = await Cart.findOne({ user: decoded.userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Create order items with snapshots
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            productSnapshot: {
                name: item.product.name,
                description: item.product.description,
                basePrice: item.product.basePrice,
            },
            quantity: item.quantity,
            price: item.price,
            customization: item.customization,
        }));

        // Calculate total
        const total = cart.total;

        // Create order
        const order = await Order.create({
            user: decoded.userId,
            items: orderItems,
            total,
            shippingAddress,
            status: 'pending',
        });

        // Clear cart
        await Cart.findByIdAndUpdate(cart._id, {
            items: [],
            total: 0,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Order placed successfully',
                orderId: order._id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
