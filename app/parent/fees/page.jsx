'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { apiGet, apiPost } from '@/lib/api';

export default function ParentFeesPage() {
    const { data: session } = useSession();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.linkedStudentId) fetchStudentData(session.user.linkedStudentId);
    }, [session]);

    const fetchStudentData = async (studentId) => {
        try {
            const res = await apiGet(`/students/${studentId}`);
            const result = await res.json();
            if (result.success) setStudent(result.data);
        } catch (err) {
            toast.error('Failed to load fee details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading fee details...</div>;
    if (!student) return <div className="p-6 text-center text-slate-500">No student linked to this account.</div>;

    const total = student.yearlyFee || 0;

    return (
        <div className="p-6 max-w-4xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Fee Details</h1>
                <p className="text-slate-500 text-sm mt-1">View fee information for {student.name}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-slate-100">
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Total Yearly Fee</p>
                        <p className="text-3xl font-bold text-slate-800">{formatCurrency(total)}</p>
                    </div>
                </div>

                <div className="pt-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-center">
                        Online fee payment is currently unavailable. Please visit the school office for fee payments.
                    </div>
                </div>
            </div>
        </div>
    );
}
