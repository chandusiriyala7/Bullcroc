import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CustomizationOption from '@/models/CustomizationOption';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();
        const options = await CustomizationOption.find({}).sort({ type: 1, displayOrder: 1 });

        return NextResponse.json(
            { success: true, options },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get customization options error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(decoded._id);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
        }

        const body = await request.json();
        const option = await CustomizationOption.create(body);

        return NextResponse.json(
            { success: true, option, message: 'Option created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create customization option error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
