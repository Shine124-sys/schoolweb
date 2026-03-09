import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { exams, generateId } from '@/lib/data';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cls = searchParams.get('class');

        let filtered = [...exams];
        if (cls) filtered = filtered.filter(e => e.class === cls);

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
        const newExam = { ...body, createdBy: session.user.id, _id: generateId(), createdAt: new Date().toISOString() };
        exams.push(newExam);

        return NextResponse.json({ success: true, data: newExam }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
