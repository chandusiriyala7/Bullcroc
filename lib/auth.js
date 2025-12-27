import jwt from 'jsonwebtoken';

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
