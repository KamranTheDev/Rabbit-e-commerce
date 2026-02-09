const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// @route  POST /api/subscribers
// @desc handles newsletter subscription
// @access Public
router.post('/subscribe', async (req, res) =>{
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }
        // Create a new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();
        return res.status(201).json({ message: 'Subscription successful' });
    }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
});


module.exports = router;