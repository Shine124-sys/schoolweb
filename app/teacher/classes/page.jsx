'use client';
import { useSession } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiGet } from '@/lib/api';

export default function TeacherClassesPage() {
    const { data: session } = useSession();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teacherProfile, setTeacherProfile] = useState(null);

    useEffect(() => {
        if (session?.user?.email) fetchTeacherData();
    }, [session]);

    const fetchTeacherData = async () => {
        try {
            // Find teacher by email via Express backend
            const res = await apiGet(`/teachers?email=${session.user.email}`);
            const result = await res.json();
            if (result.success && result.data.length > 0) {
                const profile = result.data[0];
                setTeacherProfile(profile);
                fetchStudents(profile.classAssigned, profile.sectionAssigned);
            } else {
                setLoading(false);
            }
        } catch (err) {
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    const fetchStudents = async (cls, section) => {
        try {
            const res = await apiGet(`/students?class=${cls}&section=${section}`);
            const result = await res.json();
            if (result.success) setStudents(result.data);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading your class...</div>;
    if (!teacherProfile) return <div className="p-6 text-center text-slate-500">Teacher profile not found or not assigned to a class.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto page-enter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Class Roster</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Students enrolled in <span className="font-semibold text-indigo-600">{teacherProfile.classAssigned} - {teacherProfile.sectionAssigned}</span>
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th>Roll No.</th>
                                <th>Name</th>
                                <th>Parent/Contact</th>
                                <th>Admission Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No students found in your class.</td></tr>
                            ) : students.map((student) => (
                                <tr key={student._id}>
                                    <td className="font-mono text-slate-500 text-xs">{student._id.slice(-6).toUpperCase()}</td>
                                    <td className="font-medium text-slate-800">{student.name}</td>
                                    <td>
                                        <p className="text-sm text-slate-800">{student.parentName}</p>
                                        <p className="text-xs text-slate-500">{student.phone}</p>
                                    </td>
                                    <td>{new Date(student.admissionDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
