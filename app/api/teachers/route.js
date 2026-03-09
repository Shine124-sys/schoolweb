import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { teachers, generateId } from '@/lib/data';

export async function GET() {
    try {
        return NextResponse.json({ success: true, data: [...teachers].reverse() });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const newTeacher = { ...body, _id: generateId(), createdAt: new Date().toISOString() };
        teachers.push(newTeacher);

        return NextResponse.json({ success: true, data: newTeacher }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
