const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    console.log(process.env.STRIPE_SECRET_KEY)
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
