"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { OfferCarousel } from "@/components/ui/OfferCarousel";

export default function HorizontalCardProduct({ category, heading }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(13).fill(null);
    const scrollElement = useRef();

    const { user } = useAuth();
    const { fetchCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please Login To add Cart");
            return;
        }

        try {
            const response = await fetch('/api/addtocart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id })
            });

            if (response.ok) {
                toast.success("Added to cart!");
                fetchCart();
            } else {
                toast.error("Failed to add to cart");
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/category-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category })
            });

            if (response.ok) {
                const result = await response.json();
                setData(result.data || []);
            }
        } catch (error) {
            console.error(`Error fetching products for ${category}:`, error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    const formattedOffers = data.map(product => ({
        id: product._id,
        imageSrc: product.productImage?.[0] || '/placeholder.png',
        imageAlt: product.productName,
        tag: product.category,
        title: product.productName,
        description: `Price: ${formatPrice(product.sellingPrice)}`,
        brandLogoSrc: "/bullcroc-logo-white.png",
        brandName: "Bullcroc",
        promoCode: product.price !== product.sellingPrice ? `${Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF` : "",
        href: `/product/${product._id}`,
    }));

    return (
        <div className='w-full mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4 text-center'>{heading}</h2>
            {loading ? (
                <div className="flex space-x-6 overflow-hidden pb-4">
                    {loadingList.map((_, index) => (
                        <div key={index} className='flex-shrink-0 w-[300px] h-[380px] bg-slate-200 rounded-2xl animate-pulse' />
                    ))}
                </div>
            ) : (
                <OfferCarousel offers={formattedOffers} onAddToCart={handleAddToCart} />
            )}
        </div>
    );
}
