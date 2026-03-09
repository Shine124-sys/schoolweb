import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { students } from '@/lib/data';

export async function GET(req, { params }) {
    try {
        const student = students.find(s => s._id === params.id);
        if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: student });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

        const body = await req.json();
        const index = students.findIndex(s => s._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });

        students[index] = { ...students[index], ...body };
        return NextResponse.json({ success: true, data: students[index] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

        const index = students.findIndex(s => s._id === params.id);
        if (index === -1) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });

        students.splice(index, 1);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
