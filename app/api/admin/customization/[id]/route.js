import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CustomizationOption from '@/models/CustomizationOption';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import User from '@/models/User';

export async function PUT(request, { params }) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

        await connectDB();
        const user = await User.findById(decoded._id);
        if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

        const { id } = params;
        const body = await request.json();

        const option = await CustomizationOption.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!option) {
            return NextResponse.json({ message: 'Option not found' }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, option, message: 'Option updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update customization option error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

        await connectDB();
        const user = await User.findById(decoded._id);
        if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

        const { id } = params;
        const option = await CustomizationOption.findByIdAndDelete(id);

        if (!option) {
            return NextResponse.json({ message: 'Option not found' }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, message: 'Option deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete customization option error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
