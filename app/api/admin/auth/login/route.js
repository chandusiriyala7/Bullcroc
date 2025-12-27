import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find admin
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if admin is active
        if (!admin.isActive) {
            return NextResponse.json(
                { message: 'Account is deactivated' },
                { status: 403 }
            );
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            userId: admin._id,
            email: admin.email,
            role: admin.role,
            isAdmin: true,
        });

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
            },
            { status: 200 }
        );

        // Set auth cookie
        return setAuthCookie(response, token);
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
