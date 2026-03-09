import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { calendarEvents } from '@/lib/data';

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const index = calendarEvents.findIndex(e => e._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });

        calendarEvents.splice(index, 1);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
