'use client';
import ResultEntryManager from '@/components/ResultEntryManager';

export default function TeacherResultsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Enter Student Marks</h1>
                <p className="text-slate-500 text-sm mt-1">Select an exam and subject to enter grades for your class</p>
            </div>
            <ResultEntryManager asAdmin={false} />
        </div>
    );
}
