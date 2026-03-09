'use client';
import CalendarView from '@/components/CalendarView';

export default function AdminCalendarPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">School Calendar</h1>
                <p className="text-slate-500 text-sm mt-1">Manage events, holidays, and exam dates</p>
            </div>
            <CalendarView isAdmin={true} />
        </div>
    );
}
