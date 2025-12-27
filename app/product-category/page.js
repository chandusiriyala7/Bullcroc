"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterSidebar, { MobileFilterDrawer } from "@/components/product/FilterSidebar";
import ProductGrid from "@/components/product/ProductGrid";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const productCategories = [
    { label: "All Products", value: "all" },
    { label: "Name Plates", value: "NamePlates" },
    { label: "Metal Letters", value: "MetalLetters" },
    { label: "Neon Lights Sign", value: "NeonLightsSign" },
    { label: "Home Décor", value: "HomeDecor" },
    { label: "Personalized Gifts", value: "PersonalizedGifts" },
    { label: "Carving Items", value: "CarvingItems" },
];

function ProductCategoryContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectCategory, setSelectCategory] = useState({ all: true }); // Default to All
    const [sortBy, setSortBy] = useState(sortParam || "");

    useEffect(() => {
        // Initialize selected categories from URL
        if (categoryParam) {
            if (categoryParam === 'all') {
                setSelectCategory({ all: true });
            } else {
                const categories = categoryParam.split(',').filter(Boolean);
                const categoryObj = {};
                categories.forEach(cat => {
                    categoryObj[cat] = true;
                });
                setSelectCategory(categoryObj);
            }
        } else {
            // Default to All if no params
            setSelectCategory({ all: true });
        }

        if (sortParam) {
            setSortBy(sortParam);
        }
    }, [categoryParam, sortParam]);

    useEffect(() => {
        fetchData();
    }, [selectCategory, sortBy]);

    const fetchData = async () => {
        const selectedCategories = Object.keys(selectCategory).filter(key => selectCategory[key]);

        // If 'all' is selected or no categories, fetch all (send empty)
        const categoriesToSend = selectedCategories.includes('all') ? [] : selectedCategories;

        setLoading(true);
        try {
            const payload = categoriesToSend.length > 0 ? { category: categoriesToSend } : {};

            const response = await fetch('/api/filter-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: categoriesToSend })
            });

            if (response.ok) {
                const result = await response.json();
                let productList = result.data || [];

                // Client-side Sort
                if (sortBy === 'asc') {
                    productList.sort((a, b) => (a.sellingPrice || a.price) - (b.sellingPrice || b.price));
                } else if (sortBy === 'dsc') {
                    productList.sort((a, b) => (b.sellingPrice || b.price) - (a.sellingPrice || a.price));
                }

                setData(productList);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    const updateUrl = (newCategories, newSort) => {
        const params = new URLSearchParams();

        const activeCategories = Object.keys(newCategories).filter(key => newCategories[key]);
        if (activeCategories.length > 0) {
            // Simplify URL: if 'all', don't show param or show 'all'?
            // Providing 'all' explicitly is good for clarity as per user desire.
            // I'll set 'category=all'.
            if (activeCategories.includes('all')) {
                // Should we show ?category=all? The original code didn't. 
                // But user wants "Shop now -> all category filter on".
                // I'll set 'category=all'.
                params.set('category', 'all');
            } else {
                params.set('category', activeCategories.join(','));
            }
        }

        if (newSort) {
            params.set('sort', newSort);
        }

        router.push(`/product-category?${params.toString()}`, { scroll: false });
    };

    const handleSelectCategory = (value, checked) => {
        let newCategories = {};

        if (value === 'all') {
            if (checked) {
                newCategories = { all: true };
            } else {
                // Disallowing unchecking All directly? 
                // Or if unchecked, maybe nothing selected (which renders empty or all?)
                // Better UX: Checking All clears others. Unchecking all -> nothing selected.
                newCategories = {};
            }
        } else {
            // If checking a specific category, uncheck 'all'
            newCategories = { ...selectCategory, [value]: checked };
            if (checked) {
                delete newCategories['all'];
            }

            // If nothing left selected, optional: auto-select all?
            // Let's keep it simple.
            if (!checked) {
                // If unchecking the last specific category, select 'all'? 
                // Checks remaining:
                const remaining = Object.keys(newCategories).filter(key => newCategories[key] && key !== 'all');
                if (remaining.length === 0) {
                    newCategories = { all: true };
                }
            }
        }

        setSelectCategory(newCategories);
        updateUrl(newCategories, sortBy);
    };

    const handleOnChangeSortBy = (value) => {
        setSortBy(value);
        updateUrl(selectCategory, value);
    };

    const handleClearFilters = () => {
        setSelectCategory({});
        setSortBy("");
        router.push('/product-category');
    };

    const activeCount = Object.values(selectCategory).filter(Boolean).length;

    return (
        <div className="container px-4 md:px-6">

            {/* Header Section */}
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Marketplace</h1>
                <p className="text-muted-foreground">
                    Explore our premium collection of custom-made items.
                </p>
            </div>

            {/* Mobile Filter */}
            <div className="lg:hidden mb-6">
                <MobileFilterDrawer
                    categories={productCategories}
                    selectedCategories={selectCategory}
                    onCategoryChange={handleSelectCategory}
                    sortBy={sortBy}
                    onSortChange={handleOnChangeSortBy}
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar (Desktop) */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-28">
                        <FilterSidebar
                            categories={productCategories}
                            selectedCategories={selectCategory}
                            onCategoryChange={handleSelectCategory}
                            sortBy={sortBy}
                            onSortChange={handleOnChangeSortBy}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground font-medium">
                            Showing {data.length} results
                        </p>
                        {activeCount > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <ProductGrid
                        data={data}
                        loading={loading}
                        onClearFilters={handleClearFilters}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ProductCategoryPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <Suspense fallback={<div className="flex justify-center pt-24"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <ProductCategoryContent />
            </Suspense>
        </div>
    );
}
