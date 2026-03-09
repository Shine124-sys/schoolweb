import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { exams, students, results } from '@/lib/data';

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

        const index = exams.findIndex(e => e._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Exam not found' }, { status: 404 });

        exams.splice(index, 1);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
