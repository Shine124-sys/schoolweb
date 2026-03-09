const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const apiDir = path.join(__dirname, 'app', 'api');
walkDir(apiDir, function (filePath) {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    if (content.includes('next-auth')) {
        content = content.replace(/import \{ getServerSession \} from ['"]next-auth['"];/g, "import { getServerSession } from '@/lib/auth';");
        content = content.replace(/import \{ authOptions \} from ['"]@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route['"];?[ \t]*\n?/g, "");
        content = content.replace(/getServerSession\(authOptions\)/g, "getServerSession()");
        changed = true;
    }
    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log('Updated:', filePath);
    }
});
