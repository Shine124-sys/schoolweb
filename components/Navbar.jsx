'use client';
import { useSession } from '@/components/AuthProvider';
import Image from 'next/image';

import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';


export default function Navbar({ title }) {
    const { data: session } = useSession();
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
                <Image src="/school_logo.jpeg" alt="School Logo" width={40} height={40} className="rounded" />
                <div>
                    <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
                    <p className="text-xs text-slate-400">{today}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                    <BellIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{session?.user?.name}</span>
                </div>
            </div>
        </header>
    );
}
