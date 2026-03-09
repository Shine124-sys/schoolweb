import { NextResponse } from 'next/server';
import { users, generateId } from '@/lib/data';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, role, phone, linkedStudentId } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
        }

        const existing = users.find(u => u.email === email);
        if (existing) return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { _id: generateId(), name, email, password: hashedPassword, role, phone, linkedStudentId, createdAt: new Date().toISOString() };
        users.push(newUser);

        return NextResponse.json({ success: true, data: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
