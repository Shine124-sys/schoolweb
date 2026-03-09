const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && !dirPath.includes('node_modules') && !dirPath.includes('.next')) {
            walkDir(dirPath, callback);
        } else if (!isDirectory) {
            callback(dirPath);
        }
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
    if (filePath.includes('AuthProvider.jsx')) return; // Skip our context!

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('next-auth/react')) {
        content = content.replace(/import\s+\{.*\}\s+from\s+['"]next-auth\/react['"];?\n?/g, "");
        if (content.includes('useSession')) {
            content = "import { useSession } from '@/components/AuthProvider';\n" + content;
        }
        changed = true;
    }

    if (content.match(/signOut\(/)) {
        content = content.replace(/await signOut\(\{.*?\}\);?/g, "await fetch('/api/auth/logout', { method: 'POST'}).then(()=>window.location.href='/login');");
        content = content.replace(/signOut\(\{.*?\}\);?/g, "fetch('/api/auth/logout', { method: 'POST'}).then(()=>window.location.href='/login');");
        content = content.replace(/await signOut\(\);?/g, "await fetch('/api/auth/logout', { method: 'POST'}).then(()=>window.location.href='/login');");
        content = content.replace(/signOut\(\);?/g, "fetch('/api/auth/logout', { method: 'POST'}).then(()=>window.location.href='/login');");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log('Updated Client:', filePath);
    }
}

walkDir(path.join(__dirname, 'app'), processFile);
walkDir(path.join(__dirname, 'components'), processFile);
