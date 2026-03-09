'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect, useRef } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { apiGet } from '@/lib/api';

export default function ParentResultsPage() {
    const { data: session } = useSession();
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [student, setStudent] = useState(null);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [loading, setLoading] = useState(true);
    const reportRef = useRef(null);

    useEffect(() => {
        if (session?.user?.linkedStudentId) fetchStudentData(session.user.linkedStudentId);
    }, [session]);

    const fetchStudentData = async (studentId) => {
        try {
            const sRes = await apiGet(`/students/${studentId}`);
            const sResult = await sRes.json();
            if (sResult.success) {
                setStudent(sResult.data);
                fetchExamsAndResults(sResult.data, studentId);
            }
        } catch (err) {
            toast.error('Failed to load student data');
            setLoading(false);
        }
    };

    const fetchExamsAndResults = async (stuData, stuId) => {
        try {
            const eRes = await apiGet(`/exams?class=${encodeURIComponent(stuData.class)}&section=${stuData.section}`);
            const eResult = await eRes.json();

            const rRes = await apiGet(`/results?studentId=${stuId}`);
            const rResult = await rRes.json();

            if (eResult.success && rResult.success) {
                setExams(eResult.data);
                setResults(rResult.data);
                if (eResult.data.length > 0) setSelectedExamId(eResult.data[0]._id);
            }
        } catch (err) {
            toast.error('Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!reportRef.current) return;
        const html2pdf = (await import('html2pdf.js')).default;
        const element = reportRef.current;

        // Temporarily hide the download button
        const btn = element.querySelector('.no-print');
        if (btn) btn.style.display = 'none';

        const opt = {
            margin: 10,
            filename: `${student?.name}_ReportCard.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            // Restore button
            if (btn) btn.style.display = 'block';
        });
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading results...</div>;
    if (!student) return <div className="p-6 text-center text-slate-500">No student linked to this parent account.</div>;

    const selectedExam = exams.find(e => e._id === selectedExamId);
    const currentResults = results.filter(r => r.examId === selectedExamId);

    // Calculate totals
    const totalObtained = currentResults.reduce((sum, r) => sum + r.marks, 0);
    const totalMax = currentResults.reduce((sum, r) => sum + r.maxMarks, 0);
    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;

    let finalGrade = 'N/A';
    if (totalMax > 0) {
        if (percentage >= 90) finalGrade = 'A+';
        else if (percentage >= 80) finalGrade = 'A';
        else if (percentage >= 70) finalGrade = 'B';
        else if (percentage >= 60) finalGrade = 'C';
        else if (percentage >= 50) finalGrade = 'D';
        else finalGrade = 'Fail';
    }

    return (
        <div className="p-6 max-w-4xl mx-auto page-enter">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Exam Results</h1>
                    <p className="text-slate-500 text-sm mt-1">View academic performance for {student.name}</p>
                </div>
                <div>
                    <select className="form-select text-sm font-medium pr-8" value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)}>
                        {exams.map(e => <option key={e._id} value={e._id}>{e.examName}</option>)}
                        {exams.length === 0 && <option value="">No Exams Available</option>}
                    </select>
                </div>
            </div>

            {!selectedExam ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <p className="text-slate-500">No exams scheduled or available yet.</p>
                </div>
            ) : currentResults.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-800">Results Pending</h3>
                    <p className="text-slate-500 text-sm mt-1">Marks for {selectedExam.examName} have not been published yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 mb-8" ref={reportRef}>
                    {/* Brand Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white relative">
                        <button onClick={downloadPDF} className="no-print absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2.5 transition-colors" title="Download PDF">
                            <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                        </button>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight mb-1">Global International School</h2>
                            <p className="text-indigo-100 font-medium text-sm">ACADEMIC REPORT CARD</p>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div><span className="text-slate-500 mr-2">Student Name:</span> <strong className="text-slate-800 uppercase tracking-wide">{student.name}</strong></div>
                            <div><span className="text-slate-500 mr-2">Exam:</span> <strong className="text-slate-800">{selectedExam.examName}</strong></div>
                            <div><span className="text-slate-500 mr-2">Class/Section:</span> <strong className="text-slate-800">{student.class} - {student.section}</strong></div>
                            <div><span className="text-slate-500 mr-2">Date:</span> <strong className="text-slate-800">{new Date(selectedExam.examDate).toLocaleDateString('en-GB')}</strong></div>
                        </div>
                    </div>

                    {/* Marks Table */}
                    <div className="p-8">
                        <table className="w-full text-left mb-8">
                            <thead>
                                <tr className="border-b-2 border-slate-800">
                                    <th className="py-3 px-2 font-bold text-slate-800 uppercase tracking-wider text-sm">Subject</th>
                                    <th className="py-3 px-2 font-bold text-slate-800 text-center uppercase tracking-wider text-sm">Max Marks</th>
                                    <th className="py-3 px-2 font-bold text-slate-800 text-center uppercase tracking-wider text-sm">Marks Obtained</th>
                                    <th className="py-3 px-2 font-bold text-slate-800 text-center uppercase tracking-wider text-sm">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentResults.map(res => (
                                    <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-2 font-medium text-slate-700">{res.subject}</td>
                                        <td className="py-3 px-2 text-center text-slate-500">{res.maxMarks}</td>
                                        <td className="py-3 px-2 text-center font-bold text-indigo-600">{res.marks}</td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${['A+', 'A', 'B'].includes(res.grade) ? 'bg-emerald-100 text-emerald-700' :
                                                ['C', 'D'].includes(res.grade) ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {res.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Summary Box */}
                        <div className="bg-slate-50 rounded-2xl p-6 flex flex-wrap items-center justify-around gap-6 shadow-inner border border-slate-100">
                            <div className="text-center">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Marks</p>
                                <div className="text-2xl font-black text-slate-800">{totalObtained} <span className="text-lg text-slate-400 font-medium">/ {totalMax}</span></div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                            <div className="text-center">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Percentage</p>
                                <div className="text-2xl font-black text-indigo-600">{percentage}%</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                            <div className="text-center">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Final Grade</p>
                                <div className={`text-2xl font-black tracking-tight ${['A+', 'A', 'B'].includes(finalGrade) ? 'text-emerald-500' : ['C', 'D'].includes(finalGrade) ? 'text-amber-500' : 'text-red-500'}`}>
                                    {finalGrade}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-6 text-center text-slate-400 text-xs">
                        This is a computer-generated document. No signature is required.
                    </div>
                </div>
            )}
        </div>
    );
}
