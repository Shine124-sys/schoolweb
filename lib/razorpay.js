import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
        'Razorpay credentials are missing. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file. ' +
        'Get test keys from https://dashboard.razorpay.com/app/keys'
    );
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
