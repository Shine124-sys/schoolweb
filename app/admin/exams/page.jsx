'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExamForm from '@/components/ExamForm';
import ConfirmModal from '@/components/ConfirmModal';
import { formatDate } from '@/lib/utils';
import { apiGet, apiDelete } from '@/lib/api';

export default function AdminExamsPage() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editExam, setEditExam] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await apiGet('/exams');
            const result = await res.json();
            if (result.success) setExams(result.data);
        } catch (err) {
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await apiDelete(`/exams/${deleteId}`);
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success('Exam deleted');
            setExams(exams.filter(e => e._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Exam Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Create and manage class exams</p>
                </div>
                <button onClick={() => { setEditExam(null); setShowForm(true); }} className="btn-primary">
                    <PlusIcon className="w-5 h-5" />
                    Create Exam
                </button>
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
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">Loading exams...</td></tr>
                            ) : exams.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No exams created yet.</td></tr>
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
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditExam(exam); setShowForm(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(exam._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <ExamForm
                    exam={editExam}
                    onClose={() => setShowForm(false)}
                    onSave={(saved) => {
                        setShowForm(false);
                        if (editExam) setExams(exams.map(e => e._id === saved._id ? saved : e));
                        else setExams([saved, ...exams]);
                    }}
                />
            )}

            {deleteId && (
                <ConfirmModal
                    title="Delete Exam"
                    message="Are you sure you want to delete this exam? This action cannot be undone."
                    onConfirm={handleDelete}
                    onClose={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
