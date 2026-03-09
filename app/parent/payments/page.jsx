'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { apiGet } from '@/lib/api';

export default function ParentPaymentsPage() {
    const { data: session } = useSession();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.linkedStudentId) fetchPayments(session.user.linkedStudentId);
    }, [session]);

    const fetchPayments = async (studentId) => {
        try {
            // Using Express backend payments endpoint
            const res = await apiGet(`/payments?studentId=${studentId}`);
            const result = await res.json();
            if (result.success) {
                setPayments(result.data);
            }
        } catch (err) {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
                <p className="text-slate-500 text-sm mt-1">Receipts for all previous transactions</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th className="text-right">Amount</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">Loading...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No past payments recorded.</td></tr>
                            ) : payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="text-slate-600 whitespace-nowrap">{formatDate(payment.paymentDate)}</td>
                                    <td className="font-mono text-xs text-slate-500">{payment.razorpayPaymentId || '-'}</td>
                                    <td className="text-right font-bold text-slate-800">{formatCurrency(payment.amount)}</td>
                                    <td className="text-center">
                                        <span className="badge-paid">Success</span>
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
