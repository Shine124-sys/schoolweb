import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { users } from '@/lib/data';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signToken({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            linkedStudentId: user.linkedStudentId
        });

        const response = NextResponse.json({ success: true, role: user.role });
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
