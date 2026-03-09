const fs = require('fs');
const path = require('path');

const files = [
    'app/parent/fees/page.jsx',
    'app/parent/notes/page.jsx',
    'app/parent/payments/page.jsx',
    'app/parent/results/page.jsx',
    'app/parent/syllabus/page.jsx',
    'app/teacher/classes/page.jsx',
    'app/teacher/exams/page.jsx',
    'components/Navbar.jsx',
    'components/Sidebar.jsx'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if 'use client' is somewhere in the file but not at the very top
    if (content.includes("'use client';") || content.includes('"use client";')) {
        // Remove it from wherever it is
        content = content.replace(/['"]use client['"];?\n?/g, '');
        // Prepend it to the top
        content = "'use client';\n" + content;
        fs.writeFileSync(fullPath, content);
        console.log('Fixed use client in:', file);
    }
});
