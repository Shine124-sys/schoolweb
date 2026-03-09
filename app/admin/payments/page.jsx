'use client';
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { apiGet } from '@/lib/api';

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await apiGet('/payments');
            const result = await res.json();
            if (result.success) setPayments(result.data);
        } catch (err) {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
                <p className="text-slate-500 text-sm mt-1">All successful Razorpay transactions</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Student</th>
                                <th>Class</th>
                                <th className="text-right">Amount</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Loading...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No payment records found.</td></tr>
                            ) : payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="text-slate-600 whitespace-nowrap">{formatDate(payment.paymentDate)}</td>
                                    <td className="font-mono text-xs text-slate-500">{payment.razorpayPaymentId || '-'}</td>
                                    <td className="font-medium text-slate-800">{payment.studentId?.name || 'Unknown Student'}</td>
                                    <td>
                                        {payment.studentId ? (
                                            <span className="badge-event">{payment.studentId.class} - {payment.studentId.section}</span>
                                        ) : '-'}
                                    </td>
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
