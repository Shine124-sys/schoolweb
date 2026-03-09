import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { notes, generateId } from '@/lib/data';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cls = searchParams.get('class');
        const section = searchParams.get('section');

        let filtered = [...notes];
        if (cls) filtered = filtered.filter(n => n.class === cls);
        if (section) filtered = filtered.filter(n => n.section === section);

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
        const newNote = { ...body, uploadedBy: session.user.id, _id: generateId(), createdAt: new Date().toISOString() };
        notes.push(newNote);

        return NextResponse.json({ success: true, data: newNote }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
