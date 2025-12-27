"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MotionLink = motion.create(Link);

export default function ProductCard({ product, className }) {
    const {
        _id,
        productName,
        category,
        productImage,
        sellingPrice,
        price,
    } = product;

    const discountPercentage = price && sellingPrice && price > sellingPrice
        ? Math.round(((price - sellingPrice) / price) * 100)
        : 0;

    return (
        <MotionLink
            href={`/product/${_id}`}
            className={cn(
                "group relative block bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50",
                className
            )}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                {productImage?.[0] ? (
                    <img
                        src={productImage[0]}
                        alt={productName}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}

                {/* Overlay with Quick Actions (Optional - can extend later) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            -{discountPercentage}%
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {category}
                    </p>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary transition-colors">
                        {productName}
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary">
                            {formatPrice(sellingPrice)}
                        </span>
                        {price > sellingPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover Add to Cart Button (Mobile visible always or handle differently) */}
            <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <Button size="icon" className="rounded-full shadow-lg h-10 w-10">
                    <ShoppingCart className="w-4 h-4" />
                </Button>
            </div>
        </MotionLink>
    );
}
