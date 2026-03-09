'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import StudentForm from '@/components/StudentForm';
import ConfirmModal from '@/components/ConfirmModal';
import { formatDate } from '@/lib/utils';
import { apiGet, apiDelete } from '@/lib/api';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await apiGet('/students');
            const result = await res.json();
            if (result.success) setStudents(result.data);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await apiDelete(`/students/${deleteId}`);
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success('Student deleted');
            setStudents(students.filter(s => s._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase()) ||
        (s._id.slice(-6).toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage enrollments, fees, and details</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input pl-9"
                        />
                    </div>
                    <button onClick={() => { setEditStudent(null); setShowForm(true); }} className="btn-primary whitespace-nowrap">
                        <PlusIcon className="w-5 h-5" />
                        Add Student
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Parent/Contact</th>
                                <th>Adm. Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Loading students...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No students found.</td></tr>
                            ) : filteredStudents.map((student) => (
                                <tr key={student._id}>
                                    <td className="font-mono text-slate-500 text-xs">{student._id.slice(-6).toUpperCase()}</td>
                                    <td className="font-medium text-slate-800">{student.name}</td>
                                    <td>
                                        <span className="badge-event">{student.class} - {student.section}</span>
                                    </td>
                                    <td>
                                        <p className="text-sm text-slate-800">{student.parentName}</p>
                                        <p className="text-xs text-slate-500">{student.phone}</p>
                                    </td>
                                    <td>{formatDate(student.admissionDate)}</td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditStudent(student); setShowForm(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(student._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                <StudentForm
                    student={editStudent}
                    onClose={() => setShowForm(false)}
                    onSave={(saved) => {
                        setShowForm(false);
                        if (editStudent) setStudents(students.map(s => s._id === saved._id ? saved : s));
                        else setStudents([saved, ...students]);
                    }}
                />
            )}

            {deleteId && (
                <ConfirmModal
                    title="Delete Student"
                    message="Are you sure you want to delete this student? All associated data will be lost."
                    onConfirm={handleDelete}
                    onClose={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
