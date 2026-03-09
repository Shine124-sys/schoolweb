'use client';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CLASSES, SECTIONS } from '@/lib/utils';
import { apiPost, apiPut } from '@/lib/api';

export default function StudentForm({ student, onClose, onSave }) {
    const [form, setForm] = useState({
        name: student?.name || '',
        parentName: student?.parentName || '',
        phone: student?.phone || '',
        address: student?.address || '',
        class: student?.class || CLASSES[0],
        section: student?.section || 'A',
        yearlyFee: student?.yearlyFee || '',
        admissionDate: student?.admissionDate ? student.admissionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        gender: student?.gender || 'Male',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = student ? `/students/${student._id}` : '/students';
            const res = student
                ? await apiPut(url, form)
                : await apiPost(url, form);

            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success(student ? 'Student updated!' : 'Student added!');
            onSave(result.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Student Name', type: 'text', required: true },
        { key: 'parentName', label: 'Parent Name', type: 'text', required: true },
        { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { key: 'address', label: 'Address', type: 'text', required: true },
        { key: 'yearlyFee', label: 'Yearly Fee (₹)', type: 'number', required: true },
        { key: 'admissionDate', label: 'Admission Date', type: 'date', required: true },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">{student ? 'Edit Student' : 'Add New Student'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><XMarkIcon className="w-5 h-5 text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map(f => (
                            <div key={f.key} className={f.key === 'address' ? 'col-span-2' : ''}>
                                <label className="form-label">{f.label}</label>
                                <input
                                    type={f.type}
                                    required={f.required}
                                    value={form[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="form-input"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="form-label">Class</label>
                            <select className="form-select" value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}>
                                {CLASSES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Section</label>
                            <select className="form-select" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))}>
                                {SECTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Gender</label>
                            <select className="form-select" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                                {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                            {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
