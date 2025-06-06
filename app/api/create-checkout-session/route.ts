import { stripe } from "@/lib/stripe";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { user_id, email, priceId } = body;

        let session = await stripe.checkout.sessions.create({
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                user_id: user_id,
            },
            mode: 'subscription',
            success_url: `http://localhost:3000/app`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        return Response.json({ paymentLink: session.url });
    } catch (error) {
        return Response.json({ error: error });
    }
}