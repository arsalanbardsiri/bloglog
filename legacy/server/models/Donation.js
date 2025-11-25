const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Created', 'Succeeded', 'Failed'], // Add more statuses as needed
        default: 'Created'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model, if you're tracking which user made the donation
        required: false // Set to true if you want to enforce user association with each donation
    }
}, { timestamps: true }); // Timestamps option adds `createdAt` and `updatedAt` fields

module.exports = mongoose.model('Donation', donationSchema);
