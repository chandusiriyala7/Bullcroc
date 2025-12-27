/**
 * Calculate price based on base price and customization options
 */
export function calculateCustomizationPrice(basePrice, options = {}) {
    let totalPrice = basePrice;

    // Add price modifiers from each customization option
    if (options.size?.priceModifier) {
        if (options.size.modifierType === 'percentage') {
            totalPrice += basePrice * (options.size.priceModifier / 100);
        } else {
            totalPrice += options.size.priceModifier;
        }
    }

    if (options.material?.priceModifier) {
        if (options.material.modifierType === 'percentage') {
            totalPrice += basePrice * (options.material.priceModifier / 100);
        } else {
            totalPrice += options.material.priceModifier;
        }
    }

    if (options.finish?.priceModifier) {
        if (options.finish.modifierType === 'percentage') {
            totalPrice += basePrice * (options.finish.priceModifier / 100);
        } else {
            totalPrice += options.finish.priceModifier;
        }
    }

    if (options.backing?.priceModifier) {
        if (options.backing.modifierType === 'percentage') {
            totalPrice += basePrice * (options.backing.priceModifier / 100);
        } else {
            totalPrice += options.backing.priceModifier;
        }
    }

    return Math.round(totalPrice);
}

/**
 * Serialize customization data for storage
 */
export function serializeCustomization(customization) {
    return {
        text: customization.text || '',
        font: customization.font ? {
            id: customization.font._id || customization.font.id,
            name: customization.font.name,
            value: customization.font.value,
        } : null,
        color: customization.color ? {
            id: customization.color._id || customization.color.id,
            name: customization.color.name,
            value: customization.color.value,
        } : null,
        size: customization.size ? {
            id: customization.size._id || customization.size.id,
            name: customization.size.name,
            value: customization.size.value,
        } : null,
        material: customization.material ? {
            id: customization.material._id || customization.material.id,
            name: customization.material.name,
            value: customization.material.value,
        } : null,
        finish: customization.finish ? {
            id: customization.finish._id || customization.finish.id,
            name: customization.finish.name,
            value: customization.finish.value,
        } : null,
        backing: customization.backing ? {
            id: customization.backing._id || customization.backing.id,
            name: customization.backing.name,
            value: customization.backing.value,
        } : null,
        previewSVG: customization.previewSVG || '',
    };
}
