"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { OfferCarousel } from "@/components/ui/OfferCarousel";

export default function TopProducts({ heading = "Top Products" }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(8).fill(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/top-products');

            if (response.ok) {
                const result = await response.json();
                setData(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching top products:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formattedOffers = data.map(product => ({
        id: product._id,
        imageSrc: product.productImage?.[0] || '/placeholder.png',
        imageAlt: product.productName,
        tag: product.category,
        title: product.productName,
        description: product.description || "",
        price: product.price,
        sellingPrice: product.sellingPrice,
        brandLogoSrc: "/bullcroc-logo-white.png",
        brandName: "Bullcroc",
        promoCode: product.price !== product.sellingPrice ? `${Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF` : "",
        href: `/product/${product._id}`,
    }));

    if (!loading && data.length === 0) {
        return null; // Don't show section if no top products
    }

    return (
        <div className='w-full mx-auto px-4 my-6 relative'>
            <h2 className='text-3xl font-bold py-6 text-center'>{heading}</h2>
            {loading ? (
                <div className="flex space-x-6 overflow-hidden pb-4">
                    {loadingList.map((_, index) => (
                        <div key={index} className='flex-shrink-0 w-[300px] h-[380px] bg-slate-200 rounded-2xl animate-pulse' />
                    ))}
                </div>
            ) : (
                <OfferCarousel offers={formattedOffers} />
            )}
        </div>
    );
}
