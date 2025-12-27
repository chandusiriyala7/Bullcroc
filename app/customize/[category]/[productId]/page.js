"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import NamePlateEditor from "@/components/customization/NamePlateEditor";
import NeonSignsEditor from "@/components/customization/NeonSignsEditor";
import MetalLettersEditor from "@/components/customization/MetalLettersEditor";

export default function CustomizePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-32">
                <p className="text-muted-foreground">Loading editor...</p>
            </div>
        );
    }

    if (!product) {
        return null; // Redirect handled in fetch
    }

    // Dispatcher based on Category
    // Normalize category to handle variations (CamelCase to kebab-case mapping if needed, or direct match)
    // The params.category comes from the URL. Currently links are /customize/NamePlates/...
    // So category is "NamePlates". 
    // We can loosely match.

    const category = params.category;

    const renderEditor = () => {
        // Normalize checking
        if (category === "NamePlates") {
            return <NamePlateEditor product={product} />;
        }
        if (category === "NeonSigns" || category === "NeonLightsSign") {
            return <NeonSignsEditor product={product} />;
        }
        if (category === "MetalLetters") {
            return <MetalLettersEditor product={product} />;
        }
        // Fallback or Generic
        return <NamePlateEditor product={product} />;
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.back()}>
                        ← Back to Product
                    </Button>
                </div>

                {renderEditor()}
            </div>
        </div>
    );
}
