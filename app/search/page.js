"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (query) {
            fetchResults();
        } else {
            setLoading(false);
            setProducts([]);
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data.data || []);
            } else {
                toast.error("Failed to fetch search results");
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("An error occurred while searching");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-8 pl-1">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                <p className="text-muted-foreground">
                    {query ? `Showing results for "${query}"` : "Enter a search term to find products"}
                </p>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center border border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-xl font-medium mb-2">No results found</p>
                    <p className="text-muted-foreground">Try checking your spelling or using different keywords</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-white text-black pt-24 pb-12">
            <Suspense fallback={<div className="flex justify-center pt-24"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
