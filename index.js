const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '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');

const app = express();

// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.static('public'));

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    const correctedAmount = amount * 100; // Stripe expects the amount in cents

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            correctedAmount,  // using the amount from the request body
            currency: 'usd',
            payment_method_types: ['card'],
        });
        console.log("Generated client secret:", JSON.stringify(paymentIntent));
        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
