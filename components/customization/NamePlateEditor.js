"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PreviewCanvas from "@/components/customization/PreviewCanvas";
import { generateNamePlateSVG } from "@/lib/customization/svgRenderer";
import { calculateCustomizationPrice } from "@/lib/customization/priceCalculator";
import { formatPrice } from "@/lib/utils";

export default function NamePlateEditor({ product }) {
    const [text, setText] = useState("Your Name");
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [selectedSize, setSelectedSize] = useState(null);
    const [svgPreview, setSvgPreview] = useState("");
    const [price, setPrice] = useState(product.basePrice);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    // Available options (in real app, these would come from product.customizationConfig)
    const fonts = [
        { name: "Arial", value: "Arial" },
        { name: "Times New Roman", value: "Times New Roman" },
        { name: "Georgia", value: "Georgia" },
        { name: "Courier New", value: "Courier New" },
    ];

    const colors = [
        { name: "Black", value: "#000000" },
        { name: "Gold", value: "#D4AF37" },
        { name: "Silver", value: "#C0C0C0" },
        { name: "Bronze", value: "#CD7F32" },
    ];

    const sizes = [
        { name: "Small (6x3 inches)", value: "6x3", priceModifier: 0, modifierType: "fixed", width: 300, height: 150 },
        { name: "Medium (12x6 inches)", value: "12x6", priceModifier: 200, modifierType: "fixed", width: 400, height: 200 },
        { name: "Large (18x9 inches)", value: "18x9", priceModifier: 500, modifierType: "fixed", width: 500, height: 250 },
    ];

    useEffect(() => {
        // Set default size
        if (!selectedSize && sizes.length > 0) {
            setSelectedSize(sizes[0]);
        }
    }, []);

    useEffect(() => {
        // Update preview and price whenever customization changes
        if (selectedSize) {
            const svg = generateNamePlateSVG({
                text,
                font: selectedFont,
                color: selectedColor,
                width: selectedSize.width,
                height: selectedSize.height,
                transparentBackground: true // Always use transparent background to show product image behind
            });
            setSvgPreview(svg);

            const newPrice = calculateCustomizationPrice(product.basePrice, {
                size: selectedSize,
            });
            setPrice(newPrice);
        }
    }, [text, selectedFont, selectedColor, selectedSize, product.basePrice]);

    const handleAddToCart = async () => {
        if (!user) {
            toast.info("Please login to add items to cart");
            router.push(`/auth/login?redirect=/customize/${product.category}/${product._id}`); // Fixed redirect URL
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 1,
                    customization: {
                        text,
                        font: { name: selectedFont, value: selectedFont },
                        color: { name: colors.find(c => c.value === selectedColor)?.name, value: selectedColor },
                        size: selectedSize,
                        previewSVG: svgPreview,
                    },
                    price,
                }),
            });

            if (response.ok) {
                toast.success("Added to cart!");
                router.push('/cart');
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to add to cart");
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="order-2 lg:order-1">
                <div className="sticky top-24">
                    <h3 className="text-lg font-semibold mb-4">Preview</h3>
                    <PreviewCanvas
                        svgContent={svgPreview}
                        backgroundImage={product.productImage?.[0]}
                        className="min-h-[400px] bg-slate-100"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="order-1 lg:order-2">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                            <p className="text-3xl font-bold text-primary">{formatPrice(price)}</p>
                        </div>

                        {/* Text Input */}
                        <div className="space-y-2">
                            <Label htmlFor="text">Your Text</Label>
                            <Input
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter your text"
                                maxLength={50}
                            />
                            <p className="text-xs text-muted-foreground">{text.length}/50 characters</p>
                        </div>

                        {/* Font Selection */}
                        <div className="space-y-2">
                            <Label>Font</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {fonts.map((font) => (
                                    <Button
                                        key={font.value}
                                        variant={selectedFont === font.value ? "default" : "outline"}
                                        onClick={() => setSelectedFont(font.value)}
                                        className="justify-start"
                                    >
                                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`h-12 rounded-md border-2 transition-all ${selectedColor === color.value ? 'border-primary ring-2 ring-primary' : 'border-border'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-2">
                            <Label>Size</Label>
                            <div className="space-y-2">
                                {sizes.map((size) => (
                                    <Button
                                        key={size.value}
                                        variant={selectedSize?.value === size.value ? "default" : "outline"}
                                        onClick={() => setSelectedSize(size)}
                                        className="w-full justify-between"
                                    >
                                        <span>{size.name}</span>
                                        {size.priceModifier > 0 && (
                                            <span className="text-xs">+{formatPrice(size.priceModifier)}</span>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-4">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full"
                                size="lg"
                                disabled={loading || !text.trim()}
                            >
                                {loading ? "Adding..." : "Add to Cart"}
                            </Button>
                            <Button variant="outline" className="w-full" size="lg" disabled>
                                Buy Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
