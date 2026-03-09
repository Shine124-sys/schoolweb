import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from '@/lib/auth';
import { payments, generateId } from '@/lib/data';

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentId, amount } = body;

        const bodyString = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(bodyString.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const newPayment = {
                _id: generateId(),
                studentId,
                amount: amount / 100, // convert paise back to INR
                paymentDate: new Date().toISOString(),
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                status: 'paid',
                createdAt: new Date().toISOString()
            };
            payments.push(newPayment);

            return NextResponse.json({ success: true, message: 'Payment verified successfully' });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
