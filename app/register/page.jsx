'use client';
import { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { apiPost } from '@/lib/api';

const ROLES = ['admin', 'teacher', 'parent'];

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher', phone: '' });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiPost('/auth/register', form);
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            toast.success('Account created!');
            setDone(true);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 shadow-lg">
                        <AcademicCapIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">SchoolWeb</h1>
                    <p className="text-slate-500 mt-1">Create New User Account</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {done ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Created!</h3>
                            <p className="text-slate-500 text-sm mb-6">The user can now log in with their credentials.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDone(false)} className="btn-secondary flex-1 justify-center">Add Another</button>
                                <Link href="/login" className="btn-primary flex-1 justify-center">Go to Login</Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { key: 'name', label: 'Full Name', type: 'text' },
                                { key: 'email', label: 'Email', type: 'email' },
                                { key: 'password', label: 'Password', type: 'password' },
                                { key: 'phone', label: 'Phone (optional)', type: 'tel' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="form-label">{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="form-input" required={f.key !== 'phone'} />
                                </div>
                            ))}
                            <div>
                                <label className="form-label">Role</label>
                                <select className="form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                                    {ROLES.map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-2.5">
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">
                    <Link href="/login" className="text-indigo-600 hover:underline">← Back to Login</Link>
                </p>
            </div>
        </div>
    );
}
