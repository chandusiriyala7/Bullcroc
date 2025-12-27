"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    const [userAddresses, setUserAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const { user } = useAuth();
    const { fetchCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchData();
            fetchAddresses();
        } else {
            router.push('/auth/login?redirect=/checkout');
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/view-card-product', {
                method: 'GET', // Fixed to GET
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

    const fetchAddresses = async () => {
        // TODO: Implement address fetching API
        // For now, using empty array
        setUserAddresses([]);
    };

    const handleAddressFormChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
            toast.error('Please fill in all address fields.');
            return;
        }

        // Add address to local state for now
        setUserAddresses(prev => [...prev, addressForm]);
        setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India' });
        setShowAddressForm(false);
        toast.success('Address added successfully!');
    };

    const handlePlaceOrder = async () => {
        if (userAddresses.length === 0 || selectedAddressIdx === null || !userAddresses[selectedAddressIdx]) {
            toast.error('Please add and select a delivery address.');
            return;
        }

        if (data.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        // TODO: Implement order placement API
        // const selectedAddress = userAddresses[selectedAddressIdx];

        toast.success('Order placed successfully!');
        setOrderPlaced(true);
        setOrderId('ORDER_' + Date.now());
    };

    const totalPrice = data.reduce((prev, curr) => {
        const itemPrice = curr.price || curr?.productId?.sellingPrice || 0;
        return prev + (curr.quantity * itemPrice);
    }, 0);

    const isAddressSelected = userAddresses.length > 0 && selectedAddressIdx !== null && userAddresses[selectedAddressIdx];

    if (orderPlaced) {
        // ... (Success view) ...
        return (
            <div className='container mx-auto max-w-2xl p-6 min-h-[70vh] pt-32'>
                <div className='bg-green-100 text-green-800 p-8 rounded-lg text-center'>
                    <h2 className='text-2xl font-bold mb-4'>Order Placed Successfully!</h2>
                    <p className='mb-4'>Order ID: {orderId}</p>
                    <button
                        className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition'
                        onClick={() => router.push('/account')}
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto max-w-4xl p-6 min-h-[70vh] pt-32'>
            <h2 className='text-3xl font-bold mb-8 text-center'>Checkout</h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Address Section */}
                <div>
                    {/* ... (Address Form - same as before) ... */}
                    <div className='bg-white p-6 rounded-lg shadow mb-6'>
                        <h2 className='text-xl font-semibold mb-3'>Delivery Address</h2>

                        <button
                            onClick={() => setShowAddressForm(prev => !prev)}
                            className='bg-primary text-white px-4 py-2 rounded mb-4 hover:bg-accent transition'
                        >
                            {showAddressForm ? 'Hide Address Form' : 'Add New Address'}
                        </button>

                        {showAddressForm && (
                            <form onSubmit={handleAddAddress} className='space-y-3'>
                                <input
                                    type='text'
                                    name='street'
                                    placeholder='Street Address'
                                    value={addressForm.street}
                                    onChange={handleAddressFormChange}
                                    className='w-full px-3 py-2 border rounded'
                                    required
                                />
                                <input
                                    type='text'
                                    name='city'
                                    placeholder='City'
                                    value={addressForm.city}
                                    onChange={handleAddressFormChange}
                                    className='w-full px-3 py-2 border rounded'
                                    required
                                />
                                <input
                                    type='text'
                                    name='state'
                                    placeholder='State'
                                    value={addressForm.state}
                                    onChange={handleAddressFormChange}
                                    className='w-full px-3 py-2 border rounded'
                                    required
                                />
                                <input
                                    type='text'
                                    name='zipCode'
                                    placeholder='Zip Code'
                                    value={addressForm.zipCode}
                                    onChange={handleAddressFormChange}
                                    className='w-full px-3 py-2 border rounded'
                                    required
                                />
                                <input
                                    type='text'
                                    name='country'
                                    placeholder='Country'
                                    value={addressForm.country}
                                    onChange={handleAddressFormChange}
                                    className='w-full px-3 py-2 border rounded'
                                    required
                                />
                                <button
                                    type='submit'
                                    className='bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition'
                                >
                                    Save Address
                                </button>
                            </form>
                        )}

                        <h3 className='text-lg font-semibold mt-4 mb-2'>Your Saved Addresses</h3>
                        {userAddresses.length === 0 ? (
                            <p className='text-gray-500'>No addresses saved yet. Please add one.</p>
                        ) : (
                            <div className='space-y-2'>
                                {userAddresses.map((address, index) => (
                                    <div
                                        key={index}
                                        className={`border p-3 rounded-md bg-gray-50 flex items-center justify-between cursor-pointer ${selectedAddressIdx === index ? 'border-primary border-2' : ''
                                            }`}
                                        onClick={() => setSelectedAddressIdx(index)}
                                    >
                                        <div className='flex-1'>
                                            <p className="font-medium">{address.street}, {address.city}</p>
                                            <p className="text-sm text-gray-600">{address.state} - {address.zipCode}, {address.country}</p>
                                        </div>
                                        {selectedAddressIdx === index && (
                                            <span className='ml-2 text-primary font-bold text-sm'>Selected</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <div className='bg-white rounded-lg shadow-lg p-6 sticky top-32'>
                        <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

                        <div className='space-y-3 mb-4'>
                            {data.map((product) => {
                                const itemPrice = product.price || product?.productId?.sellingPrice || 0;
                                return (
                                    <div key={product._id} className='flex justify-between text-sm'>
                                        <div className="flex flex-col">
                                            <span className='text-gray-700 font-medium'>
                                                {product?.productId?.productName} x {product.quantity}
                                            </span>
                                            {product.customization && (
                                                <span className="text-xs text-slate-500">Customized</span>
                                            )}
                                        </div>
                                        <span className='font-medium'>
                                            {formatPrice(itemPrice * product.quantity)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='border-t pt-3 space-y-2'>
                            <div className='flex items-center justify-between text-lg'>
                                <span>Subtotal</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>

                            <div className='flex items-center justify-between text-lg'>
                                <span>Shipping</span>
                                <span>{formatPrice(0)}</span>
                            </div>

                            <div className='flex items-center justify-between font-bold text-xl border-t pt-2 mt-2'>
                                <span>Total</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                        </div>

                        <button
                            className={`w-full mt-6 p-3 rounded-lg shadow transition font-semibold ${isAddressSelected
                                ? 'bg-primary hover:bg-accent text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            onClick={handlePlaceOrder}
                            disabled={!isAddressSelected}
                        >
                            {isAddressSelected ? 'Place Order (COD)' : 'Select Address to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
