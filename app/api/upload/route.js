import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${safeName}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const fileUrl = `/uploads/${filename}`;
        const fileType = file.name.split('.').pop().toLowerCase();

        return NextResponse.json({ success: true, data: { fileUrl, fileName: file.name, fileType } });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export const config = {
    api: { bodyParser: false },
};
