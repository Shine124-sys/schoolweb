'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AcademicCapIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { setToken, apiPost } from '@/lib/api';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiPost('/auth/login', form);
            const result = await res.json();
            if (!result.success) {
                toast.error(result.error || 'Invalid email or password');
            } else {
                setToken(result.token); // Store JWT in localStorage
                const role = result.role;
                if (role === 'admin') router.push('/admin/dashboard');
                else if (role === 'teacher') router.push('/teacher/dashboard');
                else if (role === 'parent') router.push('/parent/dashboard');
                else router.push('/');
            }
        } catch (err) {
            toast.error('Cannot connect to server. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = (email, password) => {
        setForm({ email, password });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Welcome back</h2>
            {searchParams?.get('error') === 'unauthorized' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    You don&apos;t have permission to access that page.
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="form-label">Email Address</label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email" required placeholder="admin@school.com"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            className="form-input pl-9"
                        />
                    </div>
                </div>
                <div>
                    <label className="form-label">Password</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="password" required placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                            className="form-input pl-9"
                        />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-2.5">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            {/* Quick login hints */}
            <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-medium tracking-wider mb-3">Demo Accounts</p>
                <div className="space-y-2">
                    {[
                        { label: '👑 Admin', email: 'admin@school.com', password: 'password123' },
                        { label: '👨‍🏫 Teacher', email: 'teacher@school.com', password: 'password123' },
                        { label: '👥 Parent', email: 'parent@school.com', password: 'password123' },
                    ].map(({ label, email, password }) => (
                        <button
                            key={email}
                            onClick={() => quickLogin(email, password)}
                            type="button"
                            className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-indigo-50 rounded-lg text-sm transition-colors group"
                        >
                            <span className="font-medium text-slate-700 group-hover:text-indigo-700">{label}</span>
                            <span className="text-slate-400 ml-2 text-xs">{email}</span>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">
                    Need an account? Ask your administrator or visit{' '}
                    <a href="/register" className="text-indigo-600 hover:underline">/register</a>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 shadow-lg">
                        <AcademicCapIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">SchoolWeb</h1>
                    <p className="text-slate-500 mt-1">School Management System</p>
                </div>

                {/* Card with Suspense for useSearchParams */}
                <Suspense fallback={<div className="bg-white p-8 rounded-2xl shadow-xl text-center">Loading login...</div>}>
                    <LoginForm />
                </Suspense>

                {/* Footer note */}
                <p className="text-center text-xs text-slate-400 mt-5">
                    First time? Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">POST /api/seed</code> to create demo data.
                </p>
            </div>
        </div>
    );
}
