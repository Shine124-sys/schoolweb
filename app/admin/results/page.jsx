'use client';
import ResultEntryManager from '@/components/ResultEntryManager';

export default function AdminResultsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Result Management</h1>
                <p className="text-slate-500 text-sm mt-1">Enter and update student marks for any exam</p>
            </div>
            <ResultEntryManager asAdmin={true} />
        </div>
    );
}
