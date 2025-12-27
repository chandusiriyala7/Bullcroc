"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PreviewCanvas from "@/components/customization/PreviewCanvas";
import { generateMetalLettersSVG } from "@/lib/customization/svgRenderer";
import { calculateCustomizationPrice } from "@/lib/customization/priceCalculator";
import { formatPrice } from "@/lib/utils";

export default function MetalLettersEditor({ product }) {
    const [text, setText] = useState("ABC");
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedFinish, setSelectedFinish] = useState(null);
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
        { name: "Georgia Bold", value: "Georgia" },
        { name: "Courier Bold", value: "Courier New" },
    ];

    const materials = [
        { name: "Stainless Steel", value: "steel", priceModifier: 0, modifierType: "fixed", color: "#C0C0C0" },
        { name: "Brass", value: "brass", priceModifier: 300, modifierType: "fixed", color: "#D4AF37" },
        { name: "Copper", value: "copper", priceModifier: 250, modifierType: "fixed", color: "#CD7F32" },
        { name: "Aluminum", value: "aluminum", priceModifier: -100, modifierType: "fixed", color: "#E8E8E8" },
    ];

    const finishes = [
        { name: "Brushed", value: "brushed", priceModifier: 0, modifierType: "fixed" },
        { name: "Polished", value: "polished", priceModifier: 150, modifierType: "fixed" },
        { name: "Matte", value: "matte", priceModifier: 50, modifierType: "fixed" },
    ];

    const sizes = [
        { name: "Small (4 inches)", value: "4in", priceModifier: 0, modifierType: "fixed", fontSize: 80 },
        { name: "Medium (8 inches)", value: "8in", priceModifier: 400, modifierType: "fixed", fontSize: 120 },
        { name: "Large (12 inches)", value: "12in", priceModifier: 800, modifierType: "fixed", fontSize: 160 },
    ];

    useEffect(() => {
        // Set defaults
        if (!selectedMaterial && materials.length > 0) {
            setSelectedMaterial(materials[0]);
        }
        if (!selectedFinish && finishes.length > 0) {
            setSelectedFinish(finishes[0]);
        }
        if (!selectedSize && sizes.length > 0) {
            setSelectedSize(sizes[0]);
        }
    }, []);

    useEffect(() => {
        // Update preview and price
        if (selectedMaterial && selectedFinish && selectedSize) {
            const svg = generateMetalLettersSVG({
                text: text.toUpperCase(),
                font: selectedFont,
                color: selectedMaterial.color,
                fontSize: selectedSize.fontSize,
                letterSpacing: 20,
            });
            setSvgPreview(svg);

            const newPrice = calculateCustomizationPrice(product.basePrice, {
                material: selectedMaterial,
                finish: selectedFinish,
                size: selectedSize,
            });
            setPrice(newPrice);
        }
    }, [text, selectedFont, selectedMaterial, selectedFinish, selectedSize, product.basePrice]);

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
                        material: selectedMaterial,
                        finish: selectedFinish,
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
                    <PreviewCanvas svgContent={svgPreview} className="min-h-[400px]" />
                    <p className="text-sm text-muted-foreground mt-4">
                        Individual metal letters with professional finish
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
                            <p className="text-sm text-muted-foreground mt-1">Price per letter</p>
                        </div>

                        {/* Text Input */}
                        <div className="space-y-2">
                            <Label htmlFor="text">Your Text (Letters Only)</Label>
                            <Input
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                                placeholder="Enter letters"
                                maxLength={20}
                                className="uppercase"
                            />
                            <p className="text-xs text-muted-foreground">{text.length}/20 letters</p>
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
                                        <span style={{ fontFamily: font.value, fontWeight: 'bold' }}>{font.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Material Selection */}
                        <div className="space-y-2">
                            <Label>Material</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {materials.map((material) => (
                                    <Button
                                        key={material.value}
                                        variant={selectedMaterial?.value === material.value ? "default" : "outline"}
                                        onClick={() => setSelectedMaterial(material)}
                                        className="justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: material.color }}
                                            />
                                            {material.name}
                                        </span>
                                        {material.priceModifier > 0 && (
                                            <span className="text-xs">+{formatPrice(material.priceModifier)}</span>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Finish Selection */}
                        <div className="space-y-2">
                            <Label>Finish</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {finishes.map((finish) => (
                                    <Button
                                        key={finish.value}
                                        variant={selectedFinish?.value === finish.value ? "default" : "outline"}
                                        onClick={() => setSelectedFinish(finish)}
                                        className="justify-start"
                                    >
                                        {finish.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-2">
                            <Label>Size (Height)</Label>
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
