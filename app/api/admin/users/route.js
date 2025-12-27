import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
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

        // Verify admin
        const adminUser = await User.findById(decoded._id);
        if (!adminUser || adminUser.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
        }

        // Fetch users (exclude passwords)
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, users },
            { status: 200 }
        );
    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
