'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TeacherForm from '@/components/TeacherForm';
import ConfirmModal from '@/components/ConfirmModal';
import { apiGet, apiDelete } from '@/lib/api';

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editTeacher, setEditTeacher] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await apiGet('/teachers');
            const result = await res.json();
            if (result.success) setTeachers(result.data);
        } catch (err) {
            toast.error('Failed to load teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await apiDelete(`/teachers/${deleteId}`);
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success('Teacher deleted');
            setTeachers(teachers.filter(t => t._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Teacher Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage teaching staff and class assignments</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input pl-9"
                        />
                    </div>
                    <button onClick={() => { setEditTeacher(null); setShowForm(true); }} className="btn-primary whitespace-nowrap">
                        <PlusIcon className="w-5 h-5" />
                        Add Teacher
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Assigned Class</th>
                                <th>Contact</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">Loading teachers...</td></tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No teachers found.</td></tr>
                            ) : filteredTeachers.map((teacher) => (
                                <tr key={teacher._id}>
                                    <td className="font-medium text-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                                {teacher.name.charAt(0).toUpperCase()}
                                            </div>
                                            {teacher.name}
                                        </div>
                                    </td>
                                    <td>{teacher.subject}</td>
                                    <td>
                                        <span className="badge-pending">{teacher.classAssigned} - {teacher.sectionAssigned}</span>
                                    </td>
                                    <td>
                                        <p className="text-sm text-slate-800">{teacher.phone}</p>
                                        <p className="text-xs text-slate-500">{teacher.email}</p>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditTeacher(teacher); setShowForm(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(teacher._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                <TeacherForm
                    teacher={editTeacher}
                    onClose={() => setShowForm(false)}
                    onSave={(saved) => {
                        setShowForm(false);
                        if (editTeacher) setTeachers(teachers.map(t => t._id === saved._id ? saved : t));
                        else setTeachers([saved, ...teachers]);
                    }}
                />
            )}

            {deleteId && (
                <ConfirmModal
                    title="Delete Teacher"
                    message="Are you sure you want to delete this teacher? All associated data will be lost."
                    onConfirm={handleDelete}
                    onClose={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
