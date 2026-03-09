import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import razorpayInstance from '@/lib/razorpay';
import { students } from '@/lib/data';

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { amount, studentId } = body;

        const student = students.find(s => s._id === studentId);
        if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });

        if (session.user.role === 'parent' && student.parentUserId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized to pay for this student' }, { status: 403 });
        }

        const options = {
            amount: amount * 100, // exact amount in paise
            currency: 'INR',
            receipt: `receipt_${studentId}_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);
        return NextResponse.json({ success: true, order });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
