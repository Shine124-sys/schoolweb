'use client';
import { useSession } from '@/components/AuthProvider';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    HomeIcon, UserGroupIcon, AcademicCapIcon, CurrencyRupeeIcon,
    CalendarIcon, DocumentTextIcon, BookOpenIcon, ChartBarIcon,
    ArrowRightOnRectangleIcon, CloudArrowUpIcon, UsersIcon,
} from '@heroicons/react/24/outline';

const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/students', label: 'Students', icon: UserGroupIcon },
    { href: '/admin/teachers', label: 'Teachers', icon: AcademicCapIcon },
    { href: '/admin/classes', label: 'Classes', icon: BookOpenIcon },
    { href: '/admin/fees', label: 'Fees', icon: CurrencyRupeeIcon },
    { href: '/admin/calendar', label: 'Calendar', icon: CalendarIcon },
    { href: '/admin/exams', label: 'Exams', icon: DocumentTextIcon },
    { href: '/admin/results', label: 'Results', icon: ChartBarIcon },
    { href: '/admin/syllabus', label: 'Syllabus', icon: DocumentTextIcon },
    { href: '/admin/notes', label: 'Notes', icon: CloudArrowUpIcon },
    { href: '/register', label: 'Add User', icon: UsersIcon },
];

const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/teacher/classes', label: 'My Classes', icon: UserGroupIcon },
    { href: '/teacher/exams', label: 'Exams', icon: DocumentTextIcon },
    { href: '/teacher/results', label: 'Enter Results', icon: ChartBarIcon },
    { href: '/teacher/upload-syllabus', label: 'Upload Syllabus', icon: DocumentTextIcon },
    { href: '/teacher/upload-notes', label: 'Upload Notes', icon: CloudArrowUpIcon },
];

const parentLinks = [
    { href: '/parent/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/parent/student-profile', label: 'Student Profile', icon: AcademicCapIcon },
    { href: '/parent/fees', label: 'Fees', icon: CurrencyRupeeIcon },
    { href: '/parent/syllabus', label: 'Syllabus', icon: DocumentTextIcon },
    { href: '/parent/notes', label: 'Notes', icon: BookOpenIcon },
    { href: '/parent/results', label: 'Report Card', icon: ChartBarIcon },
    { href: '/parent/calendar', label: 'Calendar', icon: CalendarIcon },
];

const roleLinks = { admin: adminLinks, teacher: teacherLinks, parent: parentLinks };
const roleColors = {
    admin: 'from-indigo-600 to-violet-600',
    teacher: 'from-emerald-600 to-teal-600',
    parent: 'from-blue-600 to-cyan-600',
};

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const role = session?.user?.role || 'admin';
    const links = roleLinks[role] || adminLinks;
    const gradient = roleColors[role];

    return (
        <aside
            className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-30 shadow-sm"
            style={{ width: 'var(--sidebar-width)' }}
        >
            {/* Logo */}
            <div className={`bg-gradient-to-br ${gradient} px-5 py-5`}>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <AcademicCapIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">SchoolWeb</span>
                </div>
                <p className="text-white/70 text-xs capitalize">{role} Portal</p>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${active
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                            {label}
                            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User info + logout */}
            <div className="border-t border-slate-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-semibold`}>
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{session?.user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside >
    );
}
