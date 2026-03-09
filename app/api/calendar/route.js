import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { calendarEvents, generateId } from '@/lib/data';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        let filtered = [...calendarEvents];
        if (type) filtered = filtered.filter(e => e.type === type);
        return NextResponse.json({ success: true, data: filtered });
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
        const newEvent = { ...body, createdBy: session.user.id, _id: generateId(), createdAt: new Date().toISOString() };
        calendarEvents.push(newEvent);

        return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
