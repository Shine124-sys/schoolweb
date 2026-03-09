'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { apiGet, apiPost } from '@/lib/api';

export default function ParentFeesPage() {
    const { data: session } = useSession();
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.linkedStudentId) fetchStudentData(session.user.linkedStudentId);
    }, [session]);

    const fetchStudentData = async (studentId) => {
        try {
            const [sRes, pRes] = await Promise.all([
                apiGet(`/students/${studentId}`),
                apiGet(`/payments?studentId=${studentId}`)
            ]);
            const sResult = await sRes.json();
            const pResult = await pRes.json();

            if (sResult.success) setStudent(sResult.data);
            if (pResult.success) setPayments(pResult.data);
        } catch (err) {
            toast.error('Failed to load fee details');
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!student) return;
        const paid = payments.reduce((sum, p) => sum + p.amount, 0);
        const amountDue = (student.yearlyFee || 0) - paid;
        if (amountDue <= 0) return toast.success('Fees already fully paid!');

        const resScript = await loadRazorpay();
        if (!resScript) return toast.error('Razorpay SDK failed to load. Are you online?');

        const paymentAmount = prompt(`Enter amount to pay (Max Rs. ${amountDue}):`, amountDue);
        const amountVal = parseInt(paymentAmount);
        if (isNaN(amountVal) || amountVal <= 0 || amountVal > amountDue) {
            return toast.error('Invalid amount entered');
        }

        try {
            // Updated to use Express backend routes
            const orderRes = await apiPost('/payments/create-order', {
                studentId: student._id,
                amount: amountVal
            });
            const orderResult = await orderRes.json();
            if (!orderResult.success) throw new Error(orderResult.error);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: orderResult.data.amount,
                currency: orderResult.data.currency,
                name: 'SchoolWeb Fees',
                description: `Fee payment for ${student.name}`,
                order_id: orderResult.data.id,
                handler: async function (response) {
                    const verifyRes = await apiPost('/payments/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        studentId: student._id,
                        amount: orderResult.data.amount
                    });
                    const verifyResult = await verifyRes.json();
                    if (verifyResult.success) {
                        toast.success('Payment successful!');
                        fetchStudentData(student._id); // Reload
                    } else {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: { name: session.user.name, email: session.user.email },
                theme: { color: '#4f46e5' }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            toast.error('Could not initiate payment');
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading fee details...</div>;
    if (!student) return <div className="p-6 text-center text-slate-500">No student linked to this account.</div>;

    const paid = payments.reduce((sum, p) => sum + p.amount, 0);
    const total = student.yearlyFee || 0;
    const balance = total - paid;
    const progress = total > 0 ? (paid / total) * 100 : 0;

    return (
        <div className="p-6 max-w-4xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Fee Details</h1>
                <p className="text-slate-500 text-sm mt-1">View and pay outstanding fees for {student.name}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-slate-100">
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Total Yearly Fee</p>
                        <p className="text-3xl font-bold text-slate-800">{formatCurrency(total)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Total Paid</p>
                        <p className="text-3xl font-bold text-emerald-600">{formatCurrency(paid)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Balance Due</p>
                        <p className="text-3xl font-bold text-red-500">{formatCurrency(Math.max(0, balance))}</p>
                    </div>
                </div>

                <div className="py-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Payment Progress</span>
                        <span className="text-sm font-bold text-indigo-600">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {balance > 0 ? (
                    <div className="pt-4 flex justify-between items-center bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <div>
                            <h3 className="text-lg font-bold text-indigo-900 mb-1">Pay Online</h3>
                            <p className="text-indigo-700/80 text-sm">Securely pay outstanding fees using credit card, debit card, or UPI via Razorpay.</p>
                        </div>
                        <button onClick={handlePayment} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all whitespace-nowrap">
                            Pay Now
                        </button>
                    </div>
                ) : (
                    <div className="pt-4 flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-emerald-800 font-bold mb-1">All Fees Paid!</h3>
                        <p className="text-emerald-700/80 text-sm">No outstanding balance for the current academic year.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
