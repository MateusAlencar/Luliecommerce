import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Initialize the client
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (type === 'payment') {
            const payment = new Payment(client);
            const pymentId = String(data.id);

            // Fetch payment details to verify status
            const paymentData = await payment.get({ id: pymentId });

            console.log("Webhook received for payment:", pymentId);
            console.log("Payment status:", paymentData.status);

            // TODO: Update order status in Supabase based on paymentData.external_reference or metadata
            // if (paymentData.status === 'approved') { ... }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
}
