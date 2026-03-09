'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { apiGet } from '@/lib/api';

export default function ParentNotesPage() {
    const { data: session } = useSession();
    const [student, setStudent] = useState(null);
    const [notesList, setNotesList] = useState([]);
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
                fetchNotes(sResult.data.class, sResult.data.section);
            }
        } catch (err) {
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    const fetchNotes = async (cls, section) => {
        try {
            const res = await apiGet('/notes');
            const result = await res.json();
            if (result.success) {
                const filtered = result.data.filter(s => s.class === cls && (s.section === 'All' || s.section === section));
                setNotesList(filtered);
            }
        } catch (err) {
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading study materials...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Study Materials & Notes</h1>
                <p className="text-slate-500 text-sm mt-1">Download resources uploaded by the teachers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {notesList.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-500">
                        No study materials have been uploaded yet.
                    </div>
                ) : notesList.map((item) => (
                    <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                            <CloudArrowUpIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1 leading-snug">{item.title}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-4 flex-1">{item.subject}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <span className="text-xs text-slate-400">Added {new Date(item.createdAt).toLocaleDateString()}</span>
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
                                <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
