import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { adminStats } from '@/lib/data'; // we'll calculate this dynamically
import { students, teachers, payments, calendarEvents, exams, syllabuses } from '@/lib/data';

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const totalStudents = students.length;
        const totalTeachers = teachers.length;

        let initialFees = { collected: 0, pending: 0 };
        const feeStats = students.reduce((acc, curr) => {
            const paidForStudent = payments.filter(p => p.studentId === curr._id && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
            acc.collected += paidForStudent;
            acc.pending += Math.max(0, (curr.yearlyFee || 0) - paidForStudent);
            return acc;
        }, initialFees);

        const upcomingEvents = calendarEvents.filter(e => new Date(e.date) >= new Date()).length;
        const totalExams = exams.length;
        const totalSyllabus = syllabuses.length;

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                feesCollected: feeStats.collected,
                feesPending: feeStats.pending,
                upcomingEvents,
                totalExams,
                totalSyllabus
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
