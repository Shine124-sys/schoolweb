'use client';
import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import { UserGroupIcon, AcademicCapIcon, CurrencyRupeeIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';
import { apiGet } from '@/lib/api';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalFeesCollected: 0,
        pendingFees: 0,
        totalExams: 0,
        resultsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiGet('/admin/stats');
            const result = await res.json();
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Overview of school operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={UserGroupIcon}
                    color="indigo"
                />
                <DashboardCard
                    title="Total Teachers"
                    value={stats.totalTeachers}
                    icon={AcademicCapIcon}
                    color="emerald"
                />
                <DashboardCard
                    title="Total Exams"
                    value={stats.totalExams}
                    icon={DocumentTextIcon}
                    color="violet"
                />
                <DashboardCard
                    title="Result Entries"
                    value={stats.resultsCount}
                    icon={ChartBarIcon}
                    color="blue"
                    subtitle="Total marks published"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placeholder for charts or recent activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <a href="/admin/students" className="btn-secondary">Add Student</a>
                        <a href="/admin/exams" className="btn-secondary">Schedule Exam</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
