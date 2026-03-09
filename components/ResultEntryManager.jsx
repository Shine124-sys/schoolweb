'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ResultEntryManager({ asAdmin = false }) {
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [marksData, setMarksData] = useState({}); // { studentId: { marks: number } }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            const exam = exams.find(e => e._id === selectedExamId);
            if (exam) {
                fetchStudentsAndResults(exam);
            }
        }
    }, [selectedExamId, selectedSubject]);

    const fetchExams = async () => {
        try {
            const res = await fetch('/api/exams');
            const data = await res.json();
            if (data.success) {
                setExams(data.data);
                if (data.data.length > 0) {
                    setSelectedExamId(data.data[0]._id);
                    setSelectedSubject(data.data[0].subjects[0]?.name || '');
                }
            }
        } catch (err) {
            toast.error('Failed to load exams');
        }
    };

    const fetchStudentsAndResults = async (exam) => {
        if (!selectedSubject) return;
        setLoading(true);
        try {
            // Fetch students for this class/section
            const sRes = await fetch(`/api/students?class=${encodeURIComponent(exam.class)}&section=${exam.section}`);
            const sData = await sRes.json();
            const studentsList = sData.data || [];
            setStudents(studentsList);

            // Fetch existing results for this exam
            const rRes = await fetch(`/api/results?examId=${exam._id}`);
            const rData = await rRes.json();
            const resultsList = rData.data || [];

            // Map existing results to state
            const initialMarks = {};
            studentsList.forEach(s => {
                const existing = resultsList.find(r => r.studentId._id === s._id && r.subject === selectedSubject);
                if (existing) {
                    initialMarks[s._id] = { marks: existing.marks };
                } else {
                    initialMarks[s._id] = { marks: '' }; // empty string for no marks entered yet
                }
            });
            setMarksData(initialMarks);

        } catch (err) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleMarksChange = (studentId, value) => {
        setMarksData(prev => ({ ...prev, [studentId]: { marks: value } }));
    };

    const calculateGrade = (marks, maxMarks) => {
        const p = (marks / maxMarks) * 100;
        if (p >= 90) return 'A+';
        if (p >= 80) return 'A';
        if (p >= 70) return 'B';
        if (p >= 60) return 'C';
        if (p >= 50) return 'D';
        return 'Fail';
    };

    const handleSaveAll = async () => {
        const exam = exams.find(e => e._id === selectedExamId);
        const subjectInfo = exam?.subjects.find(s => s.name === selectedSubject);
        if (!exam || !subjectInfo) return;

        setSaving(true);
        const payload = [];

        // Filter out students whose marks haven't been entered
        Object.entries(marksData).forEach(([studentId, data]) => {
            if (data.marks !== '' && data.marks !== null) {
                const m = Number(data.marks);
                payload.push({
                    studentId,
                    examId: exam._id,
                    subject: selectedSubject,
                    marks: m,
                    maxMarks: subjectInfo.maxMarks,
                    grade: calculateGrade(m, subjectInfo.maxMarks)
                });
            }
        });

        if (payload.length === 0) {
            setSaving(false);
            return toast.error('No marks entered to save');
        }

        try {
            const res = await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: payload })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            toast.success(data.message || 'Marks saved successfully');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const selectedExam = exams.find(e => e._id === selectedExamId);
    const currentSubjectInfo = selectedExam?.subjects.find(s => s.name === selectedSubject);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Controls Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-end justify-between">
                <div className="flex gap-4 flex-wrap">
                    <div>
                        <label className="form-label block text-xs">Select Exam</label>
                        <select className="form-select text-sm min-w-[200px]" value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)}>
                            {exams.map(e => (
                                <option key={e._id} value={e._id}>{e.examName} ({e.class}-{e.section})</option>
                            ))}
                            {exams.length === 0 && <option value="">No exams found</option>}
                        </select>
                    </div>

                    {selectedExam && (
                        <div>
                            <label className="form-label block text-xs">Select Subject</label>
                            <select className="form-select text-sm min-w-[150px]" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                {selectedExam.subjects.map(s => (
                                    <option key={s.name} value={s.name}>{s.name} (Max: {s.maxMarks})</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div>
                    <button onClick={handleSaveAll} disabled={saving || students.length === 0} className="btn-primary">
                        {saving ? 'Saving...' : 'Save All Marks'}
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto">
                <table className="w-full data-table">
                    <thead>
                        <tr>
                            <th>Roll No. / ID</th>
                            <th>Student Name</th>
                            <th>Subject</th>
                            <th>Marks Obtained (Max: {currentSubjectInfo?.maxMarks || '-'})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">Loading students...</td></tr>
                        ) : students.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">No students found for this class and section.</td></tr>
                        ) : students.map(student => (
                            <tr key={student._id}>
                                <td className="text-slate-500 text-xs font-mono">{student._id.slice(-6).toUpperCase()}</td>
                                <td className="font-medium text-slate-800">{student.name}</td>
                                <td>{selectedSubject}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max={currentSubjectInfo?.maxMarks || 100}
                                        value={marksData[student._id]?.marks ?? ''}
                                        onChange={e => handleMarksChange(student._id, e.target.value)}
                                        className="form-input w-28 !py-1"
                                        placeholder="Marks"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
