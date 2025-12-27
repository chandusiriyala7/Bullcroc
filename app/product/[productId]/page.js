"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const { fetchCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Name Plate Form State
    const [customization, setCustomization] = useState({
        size: "",
        color: "",
        light: "no",
        font: "",
        symbol: "",
        mounting: "",
        line1: "",
        line2: "",
        line3: "",
        instructions: ""
    });

    useEffect(() => {
        fetchProductDetails();
    }, [params.productId]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch('/api/product-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: params.productId })
            });

            if (response.ok) {
                const data = await response.json();
                setProduct(data.data);
                setActiveImage(data.data?.productImage?.[0] || "");
            } else {
                toast.error("Product not found");
                router.push('/');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login to add to cart");
            router.push('/auth/login?redirect=/product/' + params.productId);
            return;
        }

        try {
            const response = await fetch('/api/addtocart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: params.productId,
                    quantity,
                    customization: product?.category === 'NamePlates' ? customization : undefined
                })
            });

            if (response.ok) {
                toast.success("Added to cart!");
                fetchCart();
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to add to cart");
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        router.push('/cart');
    };

    const updateCustomization = (key, value) => {
        setCustomization(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-32">
                <p className="text-muted-foreground">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-32">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Product not found</p>
                    <Button onClick={() => router.push('/')}>Go Home</Button>
                </div>
            </div>
        );
    }

    const isNamePlate = product.category === 'NamePlates';

    return (
        <div className="min-h-screen bg-background pt-32 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div>
                        {/* Main Image */}
                        <div className="bg-white rounded-xl shadow ring-1 ring-slate-900/5 p-3 mb-4">
                            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.productName}
                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.productImage && product.productImage.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto scrollbar-none mb-6">
                                {product.productImage.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 bg-white ring-1 rounded p-1 hover:ring-slate-900/30 ${activeImage === img ? 'ring-slate-900/30' : 'ring-slate-900/10'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.productName} ${idx + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Custom Design Buttons (Only for Name Plates) */}
                        {isNamePlate && (
                            <div className="space-y-4 text-center">
                                <Button
                                    size="lg"
                                    className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white text-lg font-semibold py-6"
                                    onClick={() => router.push(`/customize/${product.category}/${params.productId}`)}
                                >
                                    Create your Own Design
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground font-bold text-lg">
                                            OR
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 cursor-pointer hover:underline">
                                        Click How to Create Design
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white text-lg font-semibold py-6"
                                    onClick={() => toast.info("Opening upload dialog...")}
                                >
                                    Upload Your Design
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl lg:text-4xl font-bold">{product.productName}</h1>
                            <p className="text-xl text-muted-foreground">Heading</p> {/* Placeholder Heading */}

                            {/* Product features / description lines */}
                            <div className="text-slate-600 space-y-1">
                                <p>Line 1</p>
                                <p>Line 2</p>
                                <p>Line 3</p>
                                <p>Line 4</p>
                                <p>Line 5</p>
                                <p>Line 6</p>
                            </div>
                        </div>

                        {/* Name Plate Specific Layout */}
                        {isNamePlate ? (
                            <div className="space-y-6 mt-4">
                                {/* Options Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Size Options</Label>
                                        <Select onValueChange={(v) => updateCustomization('size', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="s">Small</SelectItem>
                                                <SelectItem value="m">Medium</SelectItem>
                                                <SelectItem value="l">Large</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Colour Options</Label>
                                        <Select onValueChange={(v) => updateCustomization('color', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="black">Black</SelectItem>
                                                <SelectItem value="gold">Gold</SelectItem>
                                                <SelectItem value="silver">Silver</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Light Yes/No</Label>
                                        <div className="flex items-center gap-2 h-10 border rounded-md px-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="light"
                                                    value="yes"
                                                    checked={customization.light === 'yes'}
                                                    onChange={(e) => updateCustomization('light', e.target.value)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer ml-4">
                                                <input
                                                    type="radio"
                                                    name="light"
                                                    value="no"
                                                    checked={customization.light === 'no'}
                                                    onChange={(e) => updateCustomization('light', e.target.value)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Font Options</Label>
                                        <Select onValueChange={(v) => updateCustomization('font', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="arial">Arial</SelectItem>
                                                <SelectItem value="serif">Serif</SelectItem>
                                                <SelectItem value="script">Script</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Symbol Options</Label>
                                        <Select onValueChange={(v) => updateCustomization('symbol', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="star">Star</SelectItem>
                                                <SelectItem value="heart">Heart</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mounting Options</Label>
                                        <Select onValueChange={(v) => updateCustomization('mounting', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="wall">Wall Mount</SelectItem>
                                                <SelectItem value="stand">Desk Stand</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Names & Customizations */}
                                <div className="space-y-3">
                                    <Label className="text-lg">Names & Customizations</Label>
                                    <Input placeholder="Line 1" value={customization.line1} onChange={(e) => updateCustomization('line1', e.target.value)} />
                                    <Input placeholder="Line 2" value={customization.line2} onChange={(e) => updateCustomization('line2', e.target.value)} />
                                    <Input placeholder="Line 3" value={customization.line3} onChange={(e) => updateCustomization('line3', e.target.value)} />
                                </div>

                                {/* Instructions */}
                                <div className="space-y-3">
                                    <Label className="text-lg">Other Details / Instructions</Label>
                                    <Textarea
                                        placeholder="Suggest us something we love to customized"
                                        className="min-h-[100px]"
                                        value={customization.instructions}
                                        onChange={(e) => updateCustomization('instructions', e.target.value)}
                                    />
                                </div>

                                {/* Actions Row */}
                                <div className="flex flex-wrap items-center gap-4 pt-4">
                                    {/* Quantity */}
                                    <div className="flex items-center border rounded-md h-12">
                                        <button
                                            className="px-4 text-xl font-bold hover:bg-slate-100 h-full"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                        <button
                                            className="px-4 text-xl font-bold hover:bg-slate-100 h-full"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <Button
                                        variant="outline"
                                        className="h-12 px-8 border-2 border-black text-black font-bold hover:bg-black hover:text-white uppercase"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart
                                    </Button>

                                    {/* Buy Now */}
                                    <Button
                                        variant="outline"
                                        className="h-12 px-8 border-2 border-black text-black font-bold hover:bg-black hover:text-white uppercase"
                                        onClick={handleBuyNow}
                                    >
                                        Buy Now
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Generic Product Layout
                            <div className="flex flex-col gap-1">
                                <p className="capitalize text-slate-400 mt-1">{product.category}</p>

                                <div className="flex items-center gap-4 my-4">
                                    {product.sellingPrice && (
                                        <p className="text-2xl lg:text-3xl font-medium text-red-600">
                                            {formatPrice(product.sellingPrice)}
                                        </p>
                                    )}
                                    {product.price && product.price !== product.sellingPrice && (
                                        <p className="text-xl text-slate-400 line-through">
                                            {formatPrice(product.price)}
                                        </p>
                                    )}
                                </div>

                                {product.description && (
                                    <div className="my-4">
                                        <p className="text-slate-600 font-medium mb-1">Description:</p>
                                        <p className="text-slate-700">{product.description}</p>
                                    </div>
                                )}

                                {/* Quantity Selector */}
                                <div className="my-4">
                                    <label className="text-slate-600 font-medium mb-2 block">Quantity</label>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 my-4">
                                    <Button
                                        size="lg"
                                        onClick={handleBuyNow}
                                        className="flex-1 bg-accent hover:bg-accent/90 text-white border-2 border-accent"
                                    >
                                        Buy Now
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-primary hover:bg-accent text-white"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </Button>
                                </div>

                                {/* Customize Button */}
                                <div className="mt-4">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                        onClick={() => router.push(`/customize/${product.category}/${params.productId}`)}
                                    >
                                        Create Your Own Design
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
