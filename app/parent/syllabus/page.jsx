'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { apiGet } from '@/lib/api';

export default function ParentSyllabusPage() {
    const { data: session } = useSession();
    const [student, setStudent] = useState(null);
    const [syllabusList, setSyllabusList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.linkedStudentId) fetchStudentData(session.user.linkedStudentId);
    }, [session]);

    const fetchStudentData = async (studentId) => {
        try {
            const sRes = await apiGet(`/students/${studentId}`);
            const sResult = await sRes.json();
            if (sResult.success) {
                setStudent(sResult.data);
                fetchSyllabus(sResult.data.class, sResult.data.section);
            }
        } catch (err) {
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    const fetchSyllabus = async (cls, section) => {
        try {
            const res = await apiGet('/syllabus');
            const result = await res.json();
            if (result.success) {
                // Filter out syllabus for other classes
                const filtered = result.data.filter(s => s.class === cls && (s.section === 'All' || s.section === section));
                setSyllabusList(filtered);
            }
        } catch (err) {
            toast.error('Failed to load syllabus');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading syllabus...</div>;
    if (!student) return <div className="p-6 text-center text-slate-500">No linked student found.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Class Syllabus</h1>
                <p className="text-slate-500 text-sm mt-1">Official curriculum for {student.class} - {student.section}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {syllabusList.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-500">
                        No curriculum uploaded for this class yet.
                    </div>
                ) : syllabusList.map((item) => (
                    <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-4 flex-1">{item.subject}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <span className="text-xs text-slate-400">Added {new Date(item.createdAt).toLocaleDateString()}</span>
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
                                <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Open
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
