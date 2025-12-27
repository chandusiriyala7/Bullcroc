"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (cart) {
            setItemCount(cart.items?.length || 0);
        }
    }, [cart]);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (item) => {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });

            if (response.ok) {
                await fetchCart();
                return { success: true };
            } else {
                const data = await response.json();
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Failed to add to cart' };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchCart();
                return { success: true };
            } else {
                return { success: false, message: 'Failed to remove item' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to remove item' };
        }
    };

    const clearCart = () => {
        setCart({ items: [], total: 0 });
        setItemCount(0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                itemCount,
                fetchCart,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
