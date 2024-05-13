// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const port = 5000

const app = express();
app.use(cors());
app.use(bodyParser.json())

const UDDOKTAPAY_API_KEY = process.env.UDDOKTAPAY_API_KEY;
const UDDOKTAPAY_BASE_URL = process.env.UDDOKTAPAY_BASE_URL; // e.g., 'https://sandbox.uddoktapay.com'

app.post('/api/create-charge', async (req, res) => {
    try {
        const { fullName, email, amount } = req.body;

        const response = await axios.post(
            `${UDDOKTAPAY_BASE_URL}/api/checkout-v2`,
            {
                full_name: fullName,
                email,
                amount,
                metadata: { /* Your additional data */ },
                redirect_url: 'http://localhost:5000/success', // Update with your URLs
                cancel_url: 'http://localhost:3000/cancel',
                webhook_url: 'http://localhost:3000/webhook',
            },
            {
                headers: {
                    'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data); // Send the payment_url to the frontend
    } catch (error) {
        // Handle errors 
        console.error(error);
        res.status(500).json({ error: 'Payment creation failed' });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
