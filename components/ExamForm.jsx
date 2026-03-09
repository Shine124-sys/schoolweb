'use client';
import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CLASSES, SECTIONS } from '@/lib/utils';
import { apiPost, apiPut } from '@/lib/api';

export default function ExamForm({ exam, onClose, onSave }) {
    const [form, setForm] = useState({
        examName: exam?.examName || '',
        class: exam?.class || CLASSES[0],
        section: exam?.section || 'A',
        examDate: exam?.examDate ? exam.examDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        subjects: exam?.subjects || [{ name: '', maxMarks: 100 }],
    });
    const [loading, setLoading] = useState(false);

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...form.subjects];
        newSubjects[index][field] = value;
        setForm({ ...form, subjects: newSubjects });
    };

    const addSubject = () => {
        setForm({ ...form, subjects: [...form.subjects, { name: '', maxMarks: 100 }] });
    };

    const removeSubject = (index) => {
        if (form.subjects.length > 1) {
            const newSubjects = form.subjects.filter((_, i) => i !== index);
            setForm({ ...form, subjects: newSubjects });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.subjects.some(s => !s.name || !s.maxMarks)) {
            return toast.error('All subjects must have a name and max marks');
        }

        setLoading(true);
        try {
            const url = exam ? `/exams/${exam._id}` : '/exams';
            const res = exam
                ? await apiPut(url, form)
                : await apiPost(url, form);

            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success(exam ? 'Exam updated!' : 'Exam created!');
            onSave(result.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">{exam ? 'Edit Exam' : 'Create New Exam'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><XMarkIcon className="w-5 h-5 text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="form-label">Exam Name (e.g. Unit Test 1)</label>
                            <input type="text" required value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} className="form-input" />
                        </div>
                        <div>
                            <label className="form-label">Class</label>
                            <select className="form-select" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                                {CLASSES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Section</label>
                            <select className="form-select" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
                                {SECTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="form-label">Exam Start Date</label>
                            <input type="date" required value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} className="form-input" />
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="form-label mb-0">Subjects & Max Marks</label>
                            <button type="button" onClick={addSubject} className="btn-secondary py-1 px-2 text-xs">
                                <PlusIcon className="w-4 h-4" /> Add Subject
                            </button>
                        </div>
                        <div className="space-y-3">
                            {form.subjects.map((sub, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input
                                        type="text" placeholder="Subject Name" required
                                        value={sub.name} onChange={e => handleSubjectChange(idx, 'name', e.target.value)}
                                        className="form-input flex-1"
                                    />
                                    <input
                                        type="number" placeholder="Max Marks" required min="1"
                                        value={sub.maxMarks} onChange={e => handleSubjectChange(idx, 'maxMarks', Number(e.target.value))}
                                        className="form-input w-28"
                                    />
                                    <button type="button" onClick={() => removeSubject(idx)} disabled={form.subjects.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                            {loading ? 'Saving...' : exam ? 'Update Exam' : 'Create Exam'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
