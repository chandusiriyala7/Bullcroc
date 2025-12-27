import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password, name } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { message: 'Please provide email', error: true, success: false },
                { status: 400 }
            );
        }
        if (!password) {
            return NextResponse.json(
                { message: 'Please provide password', error: true, success: false },
                { status: 400 }
            );
        }
        if (!name) {
            return NextResponse.json(
                { message: 'Please provide name', error: true, success: false },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Already user exists.', error: true, success: false },
                { status: 400 }
            );
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            return NextResponse.json(
                { message: 'Something is wrong', error: true, success: false },
                { status: 500 }
            );
        }

        // Create user
        const userData = new User({
            name,
            email,
            password: hashPassword,
            role: 'GENERAL',
            profilePic: '',
            addresses: [],
            wishlist: []
        });

        const saveUser = await userData.save();

        const userResponse = {
            _id: saveUser._id,
            name: saveUser.name,
            email: saveUser.email,
            role: saveUser.role,
            profilePic: saveUser.profilePic
        };

        return NextResponse.json(
            {
                user: userResponse,
                success: true,
                error: false,
                message: 'User created Successfully!'
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            {
                message: error.message || error,
                error: true,
                success: false
            },
            { status: 500 }
        );
    }
}
