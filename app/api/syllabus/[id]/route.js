import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { syllabuses } from '@/lib/data';

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'teacher')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const index = syllabuses.findIndex(s => s._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        syllabuses.splice(index, 1);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
