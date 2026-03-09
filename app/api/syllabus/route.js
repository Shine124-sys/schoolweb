import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { syllabuses, generateId } from '@/lib/data';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cls = searchParams.get('class');
        const section = searchParams.get('section');

        let filtered = [...syllabuses];
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
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'teacher')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const newSyllabus = { ...body, uploadedBy: session.user.id, _id: generateId(), createdAt: new Date().toISOString() };
        syllabuses.push(newSyllabus);

        return NextResponse.json({ success: true, data: newSyllabus }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
