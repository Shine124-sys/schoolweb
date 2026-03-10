import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { adminStats } from '@/lib/data'; // we'll calculate this dynamically
import { students, teachers, calendarEvents, exams, syllabuses } from '@/lib/data';

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const totalStudents = students.length;
        const totalTeachers = teachers.length;

        const feesCollected = 0;
        const feesPending = 0;

        const upcomingEvents = calendarEvents.filter(e => new Date(e.date) >= new Date()).length;
        const totalExams = exams.length;
        const totalSyllabus = syllabuses.length;

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                feesCollected,
                feesPending,
                upcomingEvents,
                totalExams,
                totalSyllabus
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
