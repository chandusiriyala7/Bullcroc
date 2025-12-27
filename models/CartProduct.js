const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({
    productId: {
        ref: 'product',
        type: String,
    },
    quantity: Number,
    userId: String,
    customization: {
        type: Object,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const addToCartModel = mongoose.models.addToCart || mongoose.model('addToCart', addToCartSchema);

module.exports = addToCartModel;
