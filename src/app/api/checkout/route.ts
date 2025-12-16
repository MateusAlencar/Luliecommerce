import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize the client
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items } = body;

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: items.map((item: any) => ({
                    title: item.title,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.price),
                    currency_id: 'BRL',
                })),
                back_urls: {
                    success: `${req.nextUrl.origin}/pedidos`,
                    failure: `${req.nextUrl.origin}/carrinho`,
                    pending: `${req.nextUrl.origin}/pedidos`,
                },
                auto_return: 'approved',
            },
        });

        return NextResponse.json({ preferenceId: response.id, init_point: response.init_point });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
    }
}
