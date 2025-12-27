import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function getTokenFromRequest(request) {
    const token = request.cookies.get('token')?.value;
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'a3f1b2c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f678'
        );
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function getUserFromToken(request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;

    const decoded = verifyToken(token);
    return decoded;
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'a3f1b2c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f678',
        { expiresIn: '7d' }
    );
};

export const setAuthCookie = (response, token) => {
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
    });
    return response;
};

export const clearAuthCookie = (response) => {
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
    });
    return response;
};
