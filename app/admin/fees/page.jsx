'use client';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { apiGet } from '@/lib/api';

export default function AdminFeesPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await apiGet('/students');
            const result = await res.json();
            if (result.success) setStudents(result.data);
        } catch (err) {
            toast.error('Failed to load fee data');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fee Information</h1>
                    <p className="text-slate-500 text-sm mt-1">View student yearly fee structures</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-input pl-9"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Section</th>
                                <th className="text-right">Total Yearly Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">Loading fees...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No students found.</td></tr>
                            ) : filteredStudents.map((student) => {
                                return (
                                    <tr key={student._id}>
                                        <td className="font-medium text-slate-800">{student.name}</td>
                                        <td><span className="badge-event">{student.class}</span></td>
                                        <td>{student.section}</td>
                                        <td className="text-right text-slate-600 font-bold">{formatCurrency(student.yearlyFee || 0)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
