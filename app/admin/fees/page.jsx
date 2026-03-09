'use client';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { apiGet } from '@/lib/api';

export default function AdminFeesPage() {
    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [sRes, pRes] = await Promise.all([
                apiGet('/students'),
                apiGet('/payments') // Get all paid payments
            ]);
            const sResult = await sRes.json();
            const pResult = await pRes.json();

            if (sResult.success) setStudents(sResult.data);
            if (pResult.success) setPayments(pResult.data);
        } catch (err) {
            toast.error('Failed to load fee data');
        } finally {
            setLoading(false);
        }
    };
    const getStudentFees = (studentId) => {
        const studentPayments = payments.filter(p => p.studentId?._id === studentId);
        const paid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
        return paid;
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Track student fee payments and dues</p>
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
                                <th className="text-right">Total Yearly Fee</th>
                                <th className="text-right">Paid Amount</th>
                                <th className="text-right">Balance Due</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Loading fees...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No students found.</td></tr>
                            ) : filteredStudents.map((student) => {
                                const paid = getStudentFees(student._id);
                                const total = student.yearlyFee || 0;
                                const balance = total - paid;
                                const progress = total > 0 ? (paid / total) * 100 : 0;

                                return (
                                    <tr key={student._id}>
                                        <td className="font-medium text-slate-800">{student.name}</td>
                                        <td><span className="badge-event">{student.class} - {student.section}</span></td>
                                        <td className="text-right text-slate-600">{formatCurrency(total)}</td>
                                        <td className="text-right text-emerald-600 font-medium">{formatCurrency(paid)}</td>
                                        <td className="text-right font-bold text-red-500">{formatCurrency(Math.max(0, balance))}</td>
                                        <td className="text-center">
                                            {balance <= 0 ? (
                                                <span className="badge-paid text-xs">Fully Paid</span>
                                            ) : paid > 0 ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="badge-pending text-xs">Partial</span>
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-500" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="badge-failed text-xs">Unpaid</span>
                                            )}
                                        </td>
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
