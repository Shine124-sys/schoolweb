'use client';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CLASSES, SECTIONS } from '@/lib/utils';
import { apiPost, apiPut } from '@/lib/api';

export default function TeacherForm({ teacher, onClose, onSave }) {
    const [form, setForm] = useState({
        name: teacher?.name || '',
        phone: teacher?.phone || '',
        email: teacher?.email || '',
        subject: teacher?.subject || '',
        classAssigned: teacher?.classAssigned || CLASSES[0],
        sectionAssigned: teacher?.sectionAssigned || 'A',
        qualification: teacher?.qualification || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = teacher ? `/teachers/${teacher._id}` : '/teachers';
            const res = teacher
                ? await apiPut(url, form)
                : await apiPost(url, form);

            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success(teacher ? 'Teacher updated!' : 'Teacher added!');
            onSave(result.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">{teacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><XMarkIcon className="w-5 h-5 text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { key: 'name', label: 'Teacher Name', type: 'text' },
                            { key: 'phone', label: 'Phone Number', type: 'tel' },
                            { key: 'email', label: 'Email', type: 'email' },
                            { key: 'subject', label: 'Subject', type: 'text' },
                            { key: 'qualification', label: 'Qualification', type: 'text' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="form-label">{f.label}</label>
                                <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="form-input" required={f.key !== 'qualification'} />
                            </div>
                        ))}
                        <div>
                            <label className="form-label">Class Assigned</label>
                            <select className="form-select" value={form.classAssigned} onChange={e => setForm(p => ({ ...p, classAssigned: e.target.value }))}>
                                {CLASSES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Section</label>
                            <select className="form-select" value={form.sectionAssigned} onChange={e => setForm(p => ({ ...p, sectionAssigned: e.target.value }))}>
                                {SECTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                            {loading ? 'Saving...' : teacher ? 'Update Teacher' : 'Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
