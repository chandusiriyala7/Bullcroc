"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

const MotionLink = motion.create(Link);

// The individual card component with hover animation
const OfferCard = React.forwardRef(({ offer, className, ...props }, ref) => (
    <MotionLink
        ref={ref}
        href={offer.href}
        className={cn("relative flex-shrink-0 w-[300px] h-[380px] rounded-2xl overflow-hidden group snap-start block", className)}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ perspective: "1000px" }}
        {...props}
    >
        {/* Background Image */}
        <img
            src={offer.imageSrc}
            alt={offer.imageAlt}
            className="absolute inset-0 w-full h-2/4 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Card Content */}
        <div className="absolute bottom-0 left-0 right-0 h-2/4 bg-white dark:bg-zinc-900 section-bg p-5 flex flex-col justify-between border-t border-border/50">
            <div className="space-y-2">
                {/* Tag */}
                <div className="flex items-center text-xs text-muted-foreground">
                    <Tag className="w-4 h-4 mr-2 text-primary" />
                    <span>{offer.tag}</span>
                </div>
                {/* Title & Description */}
                <h3 className="text-xl font-bold text-foreground leading-tight">{offer.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-primary">
                        {offer.sellingPrice ? formatPrice(offer.sellingPrice) : null}
                    </span>
                    {offer.price && offer.sellingPrice && offer.price > offer.sellingPrice && (
                        <span className="text-sm text-muted-foreground line-through decoration-slate-500">
                            {formatPrice(offer.price)}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                    {offer.brandLogoSrc && (
                        <img src={offer.brandLogoSrc} alt={`${offer.brandName} logo`} className="w-8 h-8 rounded-full bg-muted object-contain" />
                    )}
                    <div>
                        <p className="text-xs font-semibold text-foreground">{offer.brandName}</p>
                        {offer.promoCode && (
                            <p className="text-xs text-muted-foreground">{offer.promoCode}</p>
                        )}
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transform transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    </MotionLink>
));
OfferCard.displayName = "OfferCard";

// The main carousel component with scroll functionality
const OfferCarousel = React.forwardRef(({ offers, className, ...props }, ref) => {
    const scrollContainerRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth * 0.8; // Scroll by 80% of the container width
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!offers || offers.length === 0) return null;

    return (
        <div ref={ref} className={cn("relative w-full group", className)} {...props}>
            {/* Left Scroll Button */}
            <button
                onClick={() => scroll("left")}
                className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80 disabled:opacity-0"
                aria-label="Scroll Left"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex space-x-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-2"
            >
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>

            {/* Right Scroll Button */}
            <button
                onClick={() => scroll("right")}
                className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80 disabled:opacity-0"
                aria-label="Scroll Right"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}
);
OfferCarousel.displayName = "OfferCarousel";

export { OfferCarousel, OfferCard };
