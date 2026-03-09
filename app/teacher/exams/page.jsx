'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import DashboardCard from '@/components/DashboardCard';
import { BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { apiGet } from '@/lib/api';

export default function TeacherExamsPage() {
    const { data: session } = useSession();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ upcoming: 0, past: 0 });

    useEffect(() => {
        fetchExams();
    }, [session]);

    const fetchExams = async () => {
        try {
            // Fetch exams from Express backend
            const res = await apiGet('/exams');
            const result = await res.json();
            if (result.success) {
                setExams(result.data);
                const now = new Date();
                const upcoming = result.data.filter(e => new Date(e.examDate) > now).length;
                setStats({ upcoming, past: result.data.length - upcoming });
            }
        } catch (err) {
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Exam Schedule</h1>
                <p className="text-slate-500 text-sm mt-1">View upcoming and past exams for your classes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DashboardCard title="Upcoming Exams" value={stats.upcoming} icon={BookOpenIcon} color="amber" />
                <DashboardCard title="Past Exams" value={stats.past} icon={AcademicCapIcon} color="emerald" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Class & Section</th>
                                <th>Date</th>
                                <th>Subjects</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">Loading exams...</td></tr>
                            ) : exams.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No exams scheduled yet.</td></tr>
                            ) : exams.map((exam) => (
                                <tr key={exam._id}>
                                    <td className="font-medium text-slate-800">{exam.examName}</td>
                                    <td>
                                        <span className="badge-event">{exam.class} - {exam.section}</span>
                                    </td>
                                    <td>{formatDate(exam.examDate)}</td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {exam.subjects.map((sub, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                                    {sub.name} ({sub.maxMarks})
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
