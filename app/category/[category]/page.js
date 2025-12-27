"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CategoryPage() {
    const params = useParams();
    const category = params.category;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryProducts();
    }, [category]);

    const fetchCategoryProducts = async () => {
        try {
            const response = await fetch('/api/category-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: getCategoryName(category) })
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (slug) => {
        const categoryMap = {
            'name-plates': 'NamePlates',
            'metal-letters': 'MetalLetters',
            'neon-signs': 'NeonLightsSign'
        };
        return categoryMap[slug] || slug;
    };

    const getCategoryTitle = (slug) => {
        const titleMap = {
            'name-plates': 'Name Plates',
            'metal-letters': 'Metal Letters',
            'neon-signs': 'Neon Signs'
        };
        return titleMap[slug] || slug;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">{getCategoryTitle(category)}</h1>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No products found in this category.</p>
                        <Link href="/">
                            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                                Browse All Products
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/product/${product._id}`}>
                                    <div className="aspect-square bg-muted relative overflow-hidden">
                                        {product.productImage && product.productImage[0] ? (
                                            <img
                                                src={product.productImage[0]}
                                                alt={product.productName}
                                                className="object-contain w-full h-full p-4"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                            {product.productName}
                                        </h3>
                                        {product.brandName && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {product.brandName}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {product.sellingPrice && (
                                                <p className="text-lg font-bold text-primary">
                                                    {formatPrice(product.sellingPrice)}
                                                </p>
                                            )}
                                            {product.price && product.price !== product.sellingPrice && (
                                                <p className="text-sm text-muted-foreground line-through">
                                                    {formatPrice(product.price)}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
