"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

export default function ProductGrid({ data, loading, onClearFilters }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {new Array(8).fill(null).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-border">
                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-4xl">
                    🔍
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    We couldn't find any products matching your current filters. Try adjusting your search or filters.
                </p>
                {onClearFilters && (
                    <Button onClick={onClearFilters}>
                        Clear all filters
                    </Button>
                )}
            </div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            <AnimatePresence mode="popLayout">
                {data.map((product) => (
                    <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
