"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Type, Palette, Layout, Settings, Ruler, Image as ImageIcon, Upload } from "lucide-react";
import PreviewCanvas from "@/components/customization/PreviewCanvas";
import { generateNeonSignSVG } from "@/lib/customization/svgRenderer";
import { formatPrice } from "@/lib/utils";

// External Font Loading
const FONT_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&family=Sacramento&family=Satisfy&family=Mukta+Malar:wght@700&family=Noto+Sans+Tamil:wght@700&display=swap');
`;

const FONTS = [
    { name: "Classic Script", value: "Great Vibes", category: "english" },
    { name: "Modern Neon", value: "Pacifico", category: "english" },
    { name: "Elegant", value: "Sacramento", category: "english" },
    { name: "Handwritten", value: "Dancing Script", category: "english" },
    { name: "Signature", value: "Satisfy", category: "english" },
    { name: "Tamil Bold", value: "Mukta Malar", category: "tamil" },
    { name: "Tamil Modern", value: "Noto Sans Tamil", category: "tamil" },
];

const COLORS = [
    { name: "Warm White", value: "#FFD54F", glow: "#FFF59D" },
    { name: "Cool White", value: "#E0F7FA", glow: "#B2EBF2" },
    { name: "Red", value: "#FF1744", glow: "#FF8A80" },
    { name: "Pink", value: "#F50057", glow: "#FF80AB" },
    { name: "Purple", value: "#D500F9", glow: "#EA80FC" },
    { name: "Blue", value: "#2979FF", glow: "#82B1FF" },
    { name: "Ice Blue", value: "#00E5FF", glow: "#84FFFF" },
    { name: "Green", value: "#00E676", glow: "#B9F6CA" },
    { name: "Yellow", value: "#FFEA00", glow: "#FFFF8D" },
    { name: "Orange", value: "#FF9100", glow: "#FFD180" },
];

const BACKBOARDS = [
    { id: "cut-around", name: "Cut Around Acrylic", price: 0, image: "/images/backboards/cut-around.png" },
    { id: "rectangle", name: "Rectangle Acrylic", price: 500, image: "/images/backboards/rectangle.png" },
];

export default function NeonSignsEditor({ product }) {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    // State
    const [activeTab, setActiveTab] = useState("text");
    const [text, setText] = useState("Your Text");
    const [selectedFont, setSelectedFont] = useState(FONTS[1]);
    const [selectedColor, setSelectedColor] = useState(COLORS[3]); // Pink default
    const [selectedBackboard, setSelectedBackboard] = useState(BACKBOARDS[0]);
    const [isGmOn, setIsGmOn] = useState(true);
    const [glowIntensity, setGlowIntensity] = useState(20);
    const [price, setPrice] = useState(product.basePrice);
    const [svgPreview, setSvgPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1550966871-3ed3c6227685?q=80&w=2070&auto=format&fit=crop");
    const [savedDesigns, setSavedDesigns] = useState([]);

    // Derived State
    const [dimensions, setDimensions] = useState({ width: 24, height: 8 }); // Inches

    useEffect(() => {
        // Calculate Price & Dimensions based on text length/font
        const baseWidth = Math.max(12, text.length * 2.5); // Rough estimation
        const baseHeight = baseWidth * 0.35;
        setDimensions({ width: baseWidth.toFixed(0), height: baseHeight.toFixed(0) });

        // Update SVG
        const svg = generateNeonSignSVG({
            text: text,
            font: selectedFont.value,
            color: selectedColor.value,
            glowColor: selectedColor.glow,
            width: baseWidth * 20, // Scale for SVG coord system
            height: baseHeight * 20,
            glowIntensity: isGmOn ? glowIntensity : 0,
            isOn: isGmOn
        });
        setSvgPreview(svg);

        // Price calc currently simple
        setPrice(product.basePrice + (text.length * 50) + selectedBackboard.price);

    }, [text, selectedFont, selectedColor, selectedBackboard, isGmOn, glowIntensity, product.basePrice]);

    // Helper to Convert SVG to PNG
    const generatePreviewImage = () => {
        return new Promise((resolve) => {
            const svgElement = document.createElement('div');
            svgElement.innerHTML = svgPreview;
            const svgNode = svgElement.firstChild;

            // Embed fonts (Simplified approach - rendering in canvas might still be tricky without full embedding)
            const style = document.createElement("style");
            style.textContent = FONT_STYLES;
            svgNode.appendChild(style);

            const svgData = new XMLSerializer().serializeToString(svgNode);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                canvas.width = 800; // Standardize width
                canvas.height = (800 / dimensions.width) * dimensions.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const png = canvas.toDataURL("image/png");
                URL.revokeObjectURL(url);
                resolve(png);
            };
            img.src = url;
            // Fallback for safety
            setTimeout(() => resolve(null), 2000);
        });
    };

    const handleSaveDesign = () => {
        const newDesign = {
            id: Date.now(),
            text,
            selectedFont,
            selectedColor,
            selectedBackboard,
            isGmOn,
            glowIntensity,
            previewSVG: svgPreview,
            price
        };
        setSavedDesigns(prev => [...prev, newDesign]);
        toast.success("Design saved below!");
    };

    const loadDesign = (design) => {
        setText(design.text);
        setSelectedFont(design.selectedFont);
        setSelectedColor(design.selectedColor);
        setSelectedBackboard(design.selectedBackboard);
        setIsGmOn(design.isGmOn);
        setGlowIntensity(design.glowIntensity);
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.info("Please login to save your design");
            router.push(`/auth/login?redirect=/customize/${product.category}/${product._id}`);
            return;
        }

        setLoading(true);
        try {
            const previewImage = await generatePreviewImage();

            await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 1,
                    customization: {
                        text,
                        font: selectedFont,
                        color: selectedColor,
                        backboard: selectedBackboard,
                        previewSVG: svgPreview, // Vector for re-editing
                        previewImage: previewImage, // Raster for Display/Admin
                        dimensions
                    },
                    price
                })
            });
            toast.success("Added to cart!");
            router.push('/cart');
        } catch (e) {
            toast.error("Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    const handleBgUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBgImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] bg-slate-50 overflow-hidden">
            {/* Inject Fonts */}
            <style>{FONT_STYLES}</style>

            {/* LEFT SIDE: PREVIEW CANVAS */}
            <div className="flex-1 overflow-hidden order-1 lg:order-1 flex flex-col">
                <div className="relative bg-slate-900 flex-1 flex items-center justify-center p-8 lg:p-16 overflow-hidden">
                    {/* Room Background */}
                    <div
                        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none transition-all duration-500"
                        style={{
                            backgroundImage: `url('${bgImage}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Controls Overlay */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30">
                        {/* ... Controls ... */}
                        <div className="flex flex-col gap-3">
                            {/* Power Switch */}
                            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/10 w-fit">
                                <Switch
                                    checked={isGmOn}
                                    onCheckedChange={setIsGmOn}
                                    className="data-[state=checked]:bg-green-500"
                                />
                                <span className="text-sm font-medium">{isGmOn ? "ON" : "OFF"}</span>
                            </div>

                            {/* Intensity Slider */}
                            {isGmOn && (
                                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/10 w-64 shadow-lg animate-in fade-in slide-in-from-left-4">
                                    <span className="text-xs font-medium whitespace-nowrap">Glow</span>
                                    <Slider
                                        value={[glowIntensity]}
                                        onValueChange={(val) => setGlowIntensity(val[0])}
                                        min={5}
                                        max={40}
                                        step={1}
                                        className="flex-1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Top Right Controls */}
                        <div className="flex flex-col items-end gap-2">
                            {/* Upload BG Button */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleBgUpload}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 text-xs transition-colors"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Change Wall
                                </button>
                            </div>

                            {/* Dimensions Tag */}
                            <div className="flex items-center gap-2 text-xs bg-black/50 text-white/90 px-3 py-1 rounded-md border border-white/5">
                                <Ruler className="w-3 h-3" />
                                <span>{dimensions.width}" x {dimensions.height}"</span>
                            </div>
                        </div>
                    </div>

                    {/* Neon Preview */}
                    <div className="relative z-20 w-full max-w-4xl aspect-video flex items-center justify-center">
                        <PreviewCanvas
                            svgContent={svgPreview}
                            className="bg-transparent border-0 shadow-none !p-0 w-full h-full flex items-center justify-center"
                        />
                    </div>
                </div>

                {/* SAVED DESIGNS GALLERY / FOOTER */}
                <div className="h-32 bg-slate-900 border-t border-slate-800 p-4 flex items-center gap-4 overflow-x-auto">
                    <div className="flex-shrink-0">
                        <Button onClick={handleSaveDesign} variant="outline" className="h-24 w-24 flex flex-col gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                            <Settings className="w-6 h-6" />
                            <span className="text-xs">Save Design</span>
                        </Button>
                    </div>
                    {savedDesigns.map(design => (
                        <button
                            key={design.id}
                            onClick={() => loadDesign(design)}
                            className="relative h-24 w-32 bg-slate-800 rounded-lg border border-slate-700 hover:border-primary overflow-hidden group flex-shrink-0"
                        >
                            <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none">
                                <div dangerouslySetInnerHTML={{ __html: design.previewSVG }} className="w-full h-full scale-[0.5] opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white">
                                {formatPrice(design.price)}
                            </div>
                        </button>
                    ))}
                    {savedDesigns.length === 0 && (
                        <div className="text-slate-600 text-sm italic">
                            Save your iterations here...
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: CONTROLS SIDEBAR */}
            <div className="w-full lg:w-[400px] bg-white border-l flex flex-col h-full z-20 shadow-xl order-2 lg:order-2">
                {/* Tabs Header */}
                <div className="flex border-b bg-white">
                    {[
                        { id: 'text', icon: Type, label: 'Text' },
                        { id: 'color', icon: Palette, label: 'Color' },
                        { id: 'backboard', icon: Layout, label: 'Board' },
                        { id: 'options', icon: Settings, label: 'Options' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center justify-center py-4 text-xs font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? 'text-primary border-primary bg-primary/5'
                                : 'text-slate-500 border-transparent hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5 mb-1" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-slate-50/50">

                    {activeTab === 'text' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <Label className="text-base">Enter Your Text</Label>
                                <Input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="h-12 text-lg font-medium bg-white"
                                    placeholder="Type something..."
                                    maxLength={30}
                                />
                                <p className="text-xs text-muted-foreground text-right">{text.length}/30 characters</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base">Choose Font</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {FONTS.map(font => (
                                        <button
                                            key={font.value}
                                            onClick={() => setSelectedFont(font)}
                                            className={`p-4 border rounded-lg text-center transition-all hover:shadow-md bg-white ${selectedFont.value === font.value
                                                ? 'border-primary ring-1 ring-primary bg-primary/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <span
                                                className="text-2xl block w-full truncate mb-2"
                                                style={{ fontFamily: font.value }}
                                            >
                                                {font.category === 'tamil' ? 'வணக்கம்' : 'Neon'}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{font.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'color' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                            <Label className="text-base">Choose Neon Color</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color)}
                                        className={`group relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all bg-white ${selectedColor.value === color.value
                                            ? 'border-primary ring-1 ring-primaryShadow scale-105 shadow-md'
                                            : 'border-transparent hover:border-slate-200 hover:shadow-sm'
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full shadow-inner border border-black/10 mx-auto mb-3 transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: color.value, boxShadow: `0 0 15px ${color.value}80` }}
                                        />
                                        <span className="text-xs font-semibold text-slate-600">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'backboard' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                            <Label className="text-base">Backboard Style</Label>
                            <div className="grid grid-cols-1 gap-4">
                                {BACKBOARDS.map(board => (
                                    <button
                                        key={board.id}
                                        onClick={() => setSelectedBackboard(board)}
                                        className={`flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all bg-white ${selectedBackboard.id === board.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg border flex-shrink-0 flex items-center justify-center">
                                            <img src={board.image} alt={board.name} className="w-12 h-12 object-contain opacity-50" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{board.name}</p>
                                            <p className="text-sm font-medium text-primary mt-1">
                                                {board.price === 0 ? "Free Included" : `+${formatPrice(board.price)}`}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'options' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 rounded-full">
                                        <Settings className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-base mb-1">Mounting Kit Included</p>
                                        <p className="opacity-90 leading-relaxed">Every sign comes with a free standard mounting kit (screws & spacers) for easy installation.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700">
                                <p className="font-bold mb-2">Need a Remote?</p>
                                <p>A remote dimmer can be added for <strong>+₹500</strong>. Currently available for selection in the cart.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Price & Add */}
                <div className="p-6 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Estimate</p>
                            <p className="text-3xl font-black text-slate-900">{formatPrice(price)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">Free Shipping</p>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="w-full text-lg h-14 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.99]"
                        onClick={handleAddToCart}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Layout className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
