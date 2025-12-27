import mongoose from 'mongoose';

const customizationOptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['font', 'color', 'size', 'material', 'finish', 'backing', 'mounting'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    value: {
        type: String,
        required: true,
    },
    // For fonts: font family name
    // For colors: hex code
    // For sizes: dimensions (e.g., "12x6")
    // For materials: material type

    priceModifier: {
        type: Number,
        default: 0,
    },
    // Can be percentage (e.g., 10 for 10% increase) or fixed amount

    modifierType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'fixed',
    },

    previewData: {
        type: mongoose.Schema.Types.Mixed,
        // For fonts: { fontFamily, fontWeight, etc. }
        // For colors: { hex, rgb, glowIntensity (for neon) }
        // For sizes: { width, height, unit }
    },

    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],

    isActive: {
        type: Boolean,
        default: true,
    },

    displayOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Indexes
customizationOptionSchema.index({ type: 1, isActive: 1 });
customizationOptionSchema.index({ applicableCategories: 1 });

const CustomizationOption = mongoose.models.CustomizationOption ||
    mongoose.model('CustomizationOption', customizationOptionSchema);

export default CustomizationOption;
