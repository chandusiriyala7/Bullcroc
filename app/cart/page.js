"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadingCart = new Array(4).fill(null);

    const { user } = useAuth();
    const { fetchCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/view-card-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    setData(responseData.data);
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
        setLoading(false);
    };

    const increaseQty = async (id, qty) => {
        try {
            const response = await fetch('/api/update-cart-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id, quantity: qty + 1 })
            });

            if (response.ok) {
                fetchData();
                fetchCart();
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            try {
                const response = await fetch('/api/update-cart-product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: id, quantity: qty - 1 })
                });

                if (response.ok) {
                    fetchData();
                    fetchCart();
                }
            } catch (error) {
                toast.error("Failed to update quantity");
            }
        }
    };

    const deleteCartProduct = async (id) => {
        try {
            const response = await fetch('/api/delete-cart-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id })
            });

            if (response.ok) {
                toast.success("Item removed from cart");
                fetchData();
                fetchCart();
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0);
    const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice), 0);

    if (!user) {
        return (
            <div className='container mx-auto max-w-5xl p-6 min-h-[70vh] pt-32'>
                <div className='flex flex-col items-center justify-center h-96'>
                    <div className='text-gray-500 text-lg mb-2'>Please login to view your cart</div>
                    <button
                        className='mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-accent transition'
                        onClick={() => router.push('/auth/login?redirect=/cart')}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto max-w-5xl p-6 min-h-[70vh] pt-32'>
            <h2 className='text-3xl font-bold mb-8 text-center'>My Cart</h2>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
                {/* Cart Products */}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        <div className='flex flex-col gap-4'>
                            {loadingCart.map((_, idx) => (
                                <div key={idx} className='w-full bg-slate-200 h-32 border border-slate-300 animate-pulse rounded'></div>
                            ))}
                        </div>
                    ) : data.length === 0 ? (
                        <div className='flex flex-col items-center justify-center h-96'>
                            <div className='text-gray-500 text-lg mb-2'>Your cart is empty.</div>
                            <button
                                className='mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-accent transition'
                                onClick={() => router.push('/')}
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        data.map((product) => (
                            <div
                                key={product?._id}
                                className='w-full bg-white h-auto my-4 border border-slate-300 rounded grid grid-cols-[128px,1fr] shadow-lg hover:shadow-2xl transition-shadow'
                            >
                                <div className='w-32 h-32 bg-slate-200 flex flex-col items-center justify-center rounded-l'>
                                    {product?.productId?.productImage?.[0] && (
                                        <img
                                            src={product.productId.productImage[0]}
                                            className='w-full h-full object-scale-down mix-blend-multiply'
                                            alt={product?.productId?.productName}
                                        />
                                    )}
                                </div>

                                <div className='px-4 py-2 relative flex flex-col justify-between'>
                                    {/* Delete product */}
                                    <div
                                        className='absolute right-0 top-0 text-red-600 rounded-full p-2 hover:bg-gray-600 hover:text-white cursor-pointer'
                                        onClick={() => deleteCartProduct(product?._id)}
                                    >
                                        <MdDelete />
                                    </div>

                                    <div>
                                        <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 font-semibold'>
                                            {product?.productId?.productName}
                                        </h2>
                                        <p className='capitalize text-slate-500'>{product?.productId?.category}</p>
                                    </div>

                                    <div className='flex items-center justify-between mt-2'>
                                        <p className='text-red-600 font-medium text-lg'>
                                            {formatPrice(product?.productId?.sellingPrice)}
                                        </p>
                                        <p className='text-slate-600 font-semibold text-lg'>
                                            {formatPrice(product?.productId?.sellingPrice * product?.quantity)}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-3 mt-2'>
                                        <button
                                            className='border border-red-600 text-red-600 hover:bg-gray-600 hover:text-white w-7 h-7 flex justify-center items-center rounded'
                                            onClick={() => decreaseQty(product?._id, product?.quantity)}
                                        >
                                            -
                                        </button>
                                        <span className='font-semibold'>{product?.quantity}</span>
                                        <button
                                            className='border border-red-600 text-red-600 hover:bg-gray-600 hover:text-white w-7 h-7 flex justify-center items-center rounded'
                                            onClick={() => increaseQty(product?._id, product?.quantity)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart Summary */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
                        <h2 className='text-xl font-semibold mb-4'>Summary</h2>

                        <div className='flex items-center justify-between mb-2 text-lg'>
                            <span>Items</span>
                            <span>{totalQty}</span>
                        </div>

                        <div className='flex items-center justify-between mb-2 text-lg'>
                            <span>Subtotal</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>

                        <div className='flex items-center justify-between mb-2 text-lg'>
                            <span>Shipping</span>
                            <span>{formatPrice(0)}</span>
                        </div>

                        <div className='flex items-center justify-between font-bold text-xl border-t pt-2 mt-2'>
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>

                        <button
                            className='bg-primary hover:bg-accent text-white p-3 w-full mt-6 rounded-lg shadow transition font-semibold'
                            onClick={() => router.push('/checkout')}
                            disabled={data.length === 0}
                        >
                            Proceed to Checkout
                        </button>

                        <Link href="/">
                            <button className='border border-primary text-primary hover:bg-primary hover:text-white p-3 w-full mt-3 rounded-lg transition font-semibold'>
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
