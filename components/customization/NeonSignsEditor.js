"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PreviewCanvas from "@/components/customization/PreviewCanvas";
import { generateNeonSignSVG } from "@/lib/customization/svgRenderer";
import { calculateCustomizationPrice } from "@/lib/customization/priceCalculator";
import { formatPrice } from "@/lib/utils";

export default function NeonSignsEditor({ product }) {
    const [text, setText] = useState("NEON");
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [svgPreview, setSvgPreview] = useState("");
    const [price, setPrice] = useState(product.basePrice);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    // Available options
    const fonts = [
        { name: "Arial Bold", value: "Arial" },
        { name: "Impact", value: "Impact" },
        { name: "Courier Bold", value: "Courier New" },
    ];

    const colors = [
        { name: "Hot Pink", value: "#FF1493", glow: 20 },
        { name: "Electric Blue", value: "#00BFFF", glow: 20 },
        { name: "Lime Green", value: "#00FF00", glow: 20 },
        { name: "Purple", value: "#9D00FF", glow: 20 },
        { name: "Orange", value: "#FF6600", glow: 20 },
        { name: "Red", value: "#FF0000", glow: 20 },
        { name: "Yellow", value: "#FFFF00", glow: 20 },
        { name: "White", value: "#FFFFFF", glow: 15 },
    ];

    const sizes = [
        { name: "Small (24x12 inches)", value: "24x12", priceModifier: 0, modifierType: "fixed", width: 500, height: 150 },
        { name: "Medium (36x18 inches)", value: "36x18", priceModifier: 800, modifierType: "fixed", width: 600, height: 200 },
        { name: "Large (48x24 inches)", value: "48x24", priceModifier: 1600, modifierType: "fixed", width: 700, height: 250 },
    ];

    useEffect(() => {
        // Set defaults
        if (!selectedColor && colors.length > 0) {
            setSelectedColor(colors[0]);
        }
        if (!selectedSize && sizes.length > 0) {
            setSelectedSize(sizes[0]);
        }
    }, []);

    useEffect(() => {
        // Update preview and price
        if (selectedColor && selectedSize) {
            const svg = generateNeonSignSVG({
                text: text.toUpperCase(),
                font: selectedFont,
                color: selectedColor.value,
                width: selectedSize.width,
                height: selectedSize.height,
                glowIntensity: selectedColor.glow,
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
            router.push(`/auth/login?redirect=/customize/${product._id}`);
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
                        text: text.toUpperCase(),
                        font: { name: selectedFont, value: selectedFont },
                        color: selectedColor,
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
                    <PreviewCanvas svgContent={svgPreview} className="min-h-[400px] bg-gray-900" />
                    <p className="text-sm text-muted-foreground mt-4">
                        Custom neon sign with vibrant glow effect
                    </p>
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
                                maxLength={30}
                                className="uppercase"
                            />
                            <p className="text-xs text-muted-foreground">{text.length}/30 characters</p>
                        </div>

                        {/* Font Selection */}
                        <div className="space-y-2">
                            <Label>Font</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {fonts.map((font) => (
                                    <Button
                                        key={font.value}
                                        variant={selectedFont === font.value ? "default" : "outline"}
                                        onClick={() => setSelectedFont(font.value)}
                                        className="justify-start text-xs"
                                    >
                                        <span style={{ fontFamily: font.value, fontWeight: 'bold' }}>{font.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-2">
                            <Label>Neon Color</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color)}
                                        className={`h-12 rounded-md border-2 transition-all relative overflow-hidden ${selectedColor?.value === color.value ? 'border-primary ring-2 ring-primary' : 'border-border'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        <span className="sr-only">{color.name}</span>
                                    </button>
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
