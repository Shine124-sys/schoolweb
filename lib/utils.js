export const CLASSES = [
    'PP', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

export const SECTIONS = ['A', 'B', 'C'];

export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    PARENT: 'parent',
};

export const EVENT_TYPES = ['holiday', 'event', 'exam'];

export const FILE_TYPES = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
