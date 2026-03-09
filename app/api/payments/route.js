import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { payments, students } from '@/lib/data';

export async function GET(req) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get('studentId');

        let queryRecords = [...payments];

        if (session.user.role === 'parent') {
            const student = students.find(s => s.parentUserId === session.user.id);
            if (!student) return NextResponse.json({ success: true, data: [] });
            queryRecords = queryRecords.filter(p => p.studentId === student._id);
        } else if (studentId) {
            queryRecords = queryRecords.filter(p => p.studentId === studentId);
        } else if (session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Populate student names for admin
        const populated = queryRecords.map(payment => {
            const stu = students.find(s => s._id === payment.studentId);
            return {
                ...payment,
                studentId: stu ? { _id: stu._id, name: stu.name, class: stu.class, section: stu.section } : payment.studentId
            };
        });

        return NextResponse.json({ success: true, data: populated.reverse() });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
