import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { teachers } from '@/lib/data';

export async function GET(req, { params }) {
    try {
        const teacher = teachers.find(t => t._id === params.id);
        if (!teacher) return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: teacher });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

        const body = await req.json();
        const index = teachers.findIndex(t => t._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });

        teachers[index] = { ...teachers[index], ...body };
        return NextResponse.json({ success: true, data: teachers[index] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

        const index = teachers.findIndex(t => t._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });

        teachers.splice(index, 1);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
