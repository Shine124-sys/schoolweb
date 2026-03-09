import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { students, generateId } from '@/lib/data';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cls = searchParams.get('class');
        const section = searchParams.get('section');

        let filtered = [...students];
        if (cls) filtered = filtered.filter(s => s.class === cls);
        if (section) filtered = filtered.filter(s => s.section === section);

        return NextResponse.json({ success: true, data: filtered.reverse() });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

        const body = await req.json();
        const newStudent = { ...body, _id: generateId(), createdAt: new Date().toISOString() };
        students.push(newStudent);
        return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
