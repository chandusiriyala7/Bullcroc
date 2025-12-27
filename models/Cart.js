import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        customization: {
            text: {
                type: String,
                trim: true,
            },
            font: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            color: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            size: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            material: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            finish: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            backing: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            mounting: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            previewSVG: {
                type: String,
            },
            // Serialized SVG for preview
        },
        price: {
            type: Number,
            required: true,
        },
        // Calculated price at the time of adding to cart
    }],
}, {
    timestamps: true,
});

// Indexes
cartSchema.index({ user: 1 });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
