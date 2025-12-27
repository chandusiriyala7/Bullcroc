"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailPage({ params }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { orderId } = params;

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`);
            if (response.ok) {
                const data = await response.json();
                setOrder(data.order);
            } else {
                toast.error("Order not found");
                router.push('/admin/orders');
            }
        } catch (error) {
            toast.error("Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success("Order status updated");
                fetchOrder();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "secondary",
            processing: "default",
            completed: "default",
            cancelled: "destructive",
        };
        return colors[status] || "secondary";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading order...</p>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-muted-foreground">
                        {formatDate(order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 p-4 border rounded-lg"
                                >
                                    <div className="h-20 w-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                        {item.customization?.previewSVG ? (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: item.customization.previewSVG,
                                                }}
                                                className="w-full h-full p-2"
                                            />
                                        ) : (
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">
                                            {item.productSnapshot?.name || "Product"}
                                        </h3>
                                        {item.customization?.text && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Text: &quot;{item.customization.text}&quot;
                                            </p>
                                        )}
                                        {item.customization?.font && (
                                            <p className="text-sm text-muted-foreground">
                                                Font: {item.customization.font.name}
                                            </p>
                                        )}
                                        {item.customization?.color && (
                                            <p className="text-sm text-muted-foreground">
                                                Color: {item.customization.color.name}
                                            </p>
                                        )}
                                        {item.customization?.size && (
                                            <p className="text-sm text-muted-foreground">
                                                Size: {item.customization.size.name}
                                            </p>
                                        )}
                                        <p className="text-sm font-medium mt-2">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatPrice(item.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Current Status
                                </p>
                                <Badge variant={getStatusColor(order.status)} className="text-base px-3 py-1">
                                    {order.status}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium">Update Status</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={order.status === "pending" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleStatusUpdate("pending")}
                                        disabled={updating || order.status === "pending"}
                                    >
                                        Pending
                                    </Button>
                                    <Button
                                        variant={order.status === "processing" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleStatusUpdate("processing")}
                                        disabled={updating || order.status === "processing"}
                                    >
                                        Processing
                                    </Button>
                                    <Button
                                        variant={order.status === "completed" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleStatusUpdate("completed")}
                                        disabled={updating || order.status === "completed"}
                                    >
                                        Completed
                                    </Button>
                                    <Button
                                        variant={order.status === "cancelled" ? "destructive" : "outline"}
                                        size="sm"
                                        onClick={() => handleStatusUpdate("cancelled")}
                                        disabled={updating || order.status === "cancelled"}
                                    >
                                        Cancelled
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{order.user?.name || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">
                                {order.user?.email || "No email"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items</span>
                                <span>{order.items.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
