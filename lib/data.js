import bcrypt from 'bcryptjs';

// Pre-hashed password for "password123"
const passHash = '$2a$10$w0.04L/UXYoXvjEa09k/sOhS1c4e7fUu2sIqK7A6f2k4JjA2h.vVW';

export let users = [
    { _id: 'u1', name: 'Admin Staff', email: 'admin@school.com', password: passHash, role: 'admin', phone: '9999999999' },
    { _id: 'u2', name: 'Jane Smith', email: 'teacher@school.com', password: passHash, role: 'teacher', phone: '8888888888' },
    { _id: 'u3', name: 'Robert Doe', email: 'parent@school.com', password: passHash, role: 'parent', phone: '7777777777', linkedStudentId: 's1' },
];

export let students = [
    { _id: 's1', name: 'John Doe', parentName: 'Robert Doe', phone: '7777777777', address: '123 Main St', class: 'Class 5', section: 'A', yearlyFee: 50000, admissionDate: '2025-01-10T00:00:00.000Z', parentUserId: 'u3', createdAt: '2025-01-10T00:00:00.000Z' },
    { _id: 's2', name: 'Emily Davis', parentName: 'Michael Davis', phone: '6666666666', address: '456 Oak Ave', class: 'Class 5', section: 'A', yearlyFee: 50000, admissionDate: '2025-01-12T00:00:00.000Z', createdAt: '2025-01-12T00:00:00.000Z' },
    { _id: 's3', name: 'Michael Brown', parentName: 'Sarah Brown', phone: '5555555555', address: '789 Pine Rd', class: 'Class 6', section: 'B', yearlyFee: 55000, admissionDate: '2025-01-15T00:00:00.000Z', createdAt: '2025-01-15T00:00:00.000Z' },
];

export let teachers = [
    { _id: 't1', name: 'Jane Smith', phone: '8888888888', email: 'teacher@school.com', subject: 'Mathematics', classAssigned: 'Class 5', sectionAssigned: 'A', userId: 'u2', createdAt: '2025-01-10T00:00:00.000Z' },
    { _id: 't2', name: 'David Wilson', phone: '4444444444', email: 'david@school.com', subject: 'Science', classAssigned: 'Class 6', sectionAssigned: 'B', createdAt: '2025-01-12T00:00:00.000Z' },
];


export let exams = [
    { _id: 'e1', examName: 'Unit Test 1', class: 'Class 5', section: 'A', subjects: [{ name: 'Mathematics', maxMarks: 50 }, { name: 'Science', maxMarks: 50 }, { name: 'English', maxMarks: 50 }], examDate: '2025-04-15T00:00:00.000Z', createdBy: 'u1', createdAt: '2025-04-01T00:00:00.000Z' }
];

export let results = [
    { _id: 'r1', studentId: 's1', examId: 'e1', subject: 'Mathematics', marks: 45, maxMarks: 50, grade: 'A+', createdBy: 't1', createdAt: '2025-04-16T00:00:00.000Z' },
    { _id: 'r2', studentId: 's1', examId: 'e1', subject: 'Science', marks: 42, maxMarks: 50, grade: 'A', createdBy: 't1', createdAt: '2025-04-16T00:00:00.000Z' },
    { _id: 'r3', studentId: 's1', examId: 'e1', subject: 'English', marks: 38, maxMarks: 50, grade: 'B+', createdBy: 't1', createdAt: '2025-04-16T00:00:00.000Z' }
];

export let calendarEvents = [
    { _id: 'c1', title: 'Republic Day', date: '2025-01-26T00:00:00.000Z', type: 'holiday', description: 'National Holiday', createdAt: '2024-12-01T00:00:00.000Z' },
    { _id: 'c2', title: 'Annual Sports Day', date: '2025-03-15T00:00:00.000Z', type: 'event', description: 'School Annual Sports Day', createdAt: '2024-12-01T00:00:00.000Z' },
    { _id: 'c3', title: 'Mid-Term Exams', date: '2025-09-01T00:00:00.000Z', endDate: '2025-09-10T00:00:00.000Z', type: 'exam', description: 'Mid-Term Examination', createdAt: '2024-12-01T00:00:00.000Z' }
];

export let syllabuses = [
    { _id: 'sy1', class: 'Class 5', section: 'A', subject: 'Mathematics', fileName: 'Math_Syllabus.pdf', fileUrl: '/uploads/demo.pdf', uploadedBy: 't1', createdAt: '2025-01-10T00:00:00.000Z' }
];

export let notes = [
    { _id: 'n1', class: 'Class 5', section: 'A', subject: 'Science', fileName: 'Chapter_1.pdf', fileUrl: '/uploads/demo.pdf', uploadedBy: 't1', fileType: 'application/pdf', createdAt: '2025-01-15T00:00:00.000Z' }
];

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);
