import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { results, students, exams, generateId } from '@/lib/data';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get('studentId');
        const examId = searchParams.get('examId');

        let filtered = [...results];
        if (studentId) filtered = filtered.filter(r => r.studentId === studentId);
        if (examId) filtered = filtered.filter(r => r.examId === examId);

        const populated = filtered.map(r => {
            const stu = students.find(s => s._id === r.studentId);
            const exm = exams.find(e => e._id === r.examId);
            return {
                ...r,
                studentId: stu ? { _id: stu._id, name: stu.name, class: stu.class, section: stu.section } : r.studentId,
                examId: exm ? { _id: exm._id, examName: exm.examName } : r.examId
            };
        });

        return NextResponse.json({ success: true, data: populated });
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

        const { examId, subject, results: newMarks } = await req.json();

        // Emulate upsert
        for (const mrk of newMarks) {
            const existingIdx = results.findIndex(r => r.examId === examId && r.subject === subject && r.studentId === mrk.studentId);
            if (existingIdx !== -1) {
                results[existingIdx] = { ...results[existingIdx], marks: mrk.marks, maxMarks: mrk.maxMarks, grade: mrk.grade };
            } else {
                results.push({
                    _id: generateId(), studentId: mrk.studentId, examId, subject,
                    marks: mrk.marks, maxMarks: mrk.maxMarks, grade: mrk.grade,
                    createdBy: session.user.id, createdAt: new Date().toISOString()
                });
            }
        }

        return NextResponse.json({ success: true, message: 'Results saved successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
