import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'super-secret-key-123';
const key = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

// Restored: Verifies the token using Next.js 15 async cookies correctly
export async function getServerSession() {
    try {
        // Next.js 15 requires cookies() to be awaited
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const decoded = await verifyToken(token);
        if (!decoded) return null;

        return {
            user: {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role,
                linkedStudentId: decoded.linkedStudentId
            }
        };
    } catch (err) {
        return null;
    }
}
