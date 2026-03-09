import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
        return NextResponse.json(session);
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
