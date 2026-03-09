'use client';
import { useState, useEffect } from 'react';
import { CLASSES, SECTIONS } from '@/lib/utils';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

export default function AdminSyllabusPage() {
    const [syllabusList, setSyllabusList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [cls, setCls] = useState(CLASSES[0]);
    const [section, setSection] = useState('All');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            const res = await apiGet('/syllabus');
            const result = await res.json();
            if (result.success) setSyllabusList(result.data);
        } catch (err) {
            toast.error('Failed to load syllabus');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a PDF file');

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload File to Next.js API (local)
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadResult = await uploadRes.json();
            if (!uploadResult.success) throw new Error(uploadResult.error || 'Upload failed');

            // 2. Create Syllabus Record on Express Backend
            const sysRes = await apiPost('/syllabus', {
                title, class: cls, section, subject, fileUrl: uploadResult.data.fileUrl
            });
            const sysResult = await sysRes.json();
            if (!sysResult.success) throw new Error(sysResult.error);

            toast.success('Syllabus uploaded');
            setShowForm(false);
            resetForm();
            fetchSyllabus();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setTitle(''); setCls(CLASSES[0]); setSection('All'); setSubject(''); setFile(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this syllabus?')) return;
        try {
            const res = await apiDelete(`/syllabus/${id}`);
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            toast.success('Deleted successfully');
            setSyllabusList(syllabusList.filter(s => s._id !== id));
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Syllabus Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Upload and manage class curriculums</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <PlusIcon className="w-5 h-5" /> Upload File
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full data-table">
                    <thead>
                        <tr>
                            <th>Title / Subject</th>
                            <th>Class</th>
                            <th>Upload Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">Loading...</td></tr>
                        ) : syllabusList.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">No syllabus uploaded yet.</td></tr>
                        ) : syllabusList.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <p className="font-medium text-slate-800">{item.title}</p>
                                    <p className="text-xs text-slate-500">{item.subject}</p>
                                </td>
                                <td><span className="badge-event">{item.class} {item.section !== 'All' ? `- ${item.section}` : ''}</span></td>
                                <td className="text-slate-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex items-center justify-end gap-2">
                                        <a href={item.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                        </a>
                                        <button onClick={() => handleDelete(item._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Upload Syllabus</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="form-label">Document Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="e.g. Maths Term 1 Syllabus" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Class</label>
                                    <select value={cls} onChange={e => setCls(e.target.value)} className="form-select text-sm">
                                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Section</label>
                                    <select value={section} onChange={e => setSection(e.target.value)} className="form-select text-sm">
                                        <option value="All">All Sections</option>
                                        {SECTIONS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Subject</label>
                                <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="form-input" placeholder="e.g. Mathematics" />
                            </div>
                            <div>
                                <label className="form-label">PDF File</label>
                                <input type="file" required accept="application/pdf" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={uploading} className="btn-primary flex-1 justify-center">{uploading ? 'Uploading...' : 'Upload'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
