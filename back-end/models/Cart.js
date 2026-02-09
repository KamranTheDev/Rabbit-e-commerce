const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    },
    name: String,
    image: String,
    size: String,
    price: Number, // Changed from String to Number for consistency
    color: String,
    quantity: {
        type: Number,
        default: 1,
    },
}, {
    _id: false,
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    guestId: {
        type: String,
    },
    products: [cartItemSchema], // Changed from "items" to "products"
    totalPrice: {
        type: Number,
        default: 0,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);