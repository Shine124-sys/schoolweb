'use client';
import AdminSyllabusPage from '@/app/admin/syllabus/page';

// Reuse the Admin UI for Teacher for simplicity. The API handles role logic if needed.
// Real app might scope the syllabus dropdowns strictly to the teacher's assigned class.
export default function TeacherSyllabusPage() {
    return <AdminSyllabusPage />;
}
