"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Package, User, LogOut, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function AccountPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login?redirect=/account');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/user/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
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
            month: 'short',
            day: 'numeric',
        });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">My Account</h1>
                        <p className="text-muted-foreground">
                            Manage your orders and account settings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-4 border-b">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>

                                        <nav className="space-y-2">
                                            <button
                                                onClick={() => setActiveTab("orders")}
                                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeTab === "orders"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                    }`}
                                            >
                                                <Package className="h-4 w-4" />
                                                <span>My Orders</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("profile")}
                                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeTab === "profile"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                    }`}
                                            >
                                                <User className="h-4 w-4" />
                                                <span>Profile</span>
                                            </button>
                                        </nav>

                                        <div className="pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={logout}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {activeTab === "orders" && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Order History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {loading ? (
                                                <p className="text-center py-8 text-muted-foreground">
                                                    Loading orders...
                                                </p>
                                            ) : orders.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                    <p className="text-muted-foreground mb-4">
                                                        No orders yet
                                                    </p>
                                                    <Link href="/">
                                                        <Button>Start Shopping</Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {orders.map((order) => (
                                                        <div
                                                            key={order._id}
                                                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div>
                                                                    <p className="font-semibold">
                                                                        Order #{order._id.slice(-8).toUpperCase()}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {formatDate(order.createdAt)}
                                                                    </p>
                                                                </div>
                                                                <Badge variant={getStatusColor(order.status)}>
                                                                    {order.status}
                                                                </Badge>
                                                            </div>

                                                            <div className="space-y-2 mb-4">
                                                                {order.items.map((item, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center gap-3 text-sm"
                                                                    >
                                                                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                                                                            {item.customization?.previewSVG ? (
                                                                                <div
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: item.customization.previewSVG,
                                                                                    }}
                                                                                    className="w-full h-full"
                                                                                />
                                                                            ) : (
                                                                                <Package className="h-6 w-6 text-muted-foreground" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="font-medium">
                                                                                {item.productSnapshot?.name || "Product"}
                                                                            </p>
                                                                            {item.customization?.text && (
                                                                                <p className="text-muted-foreground">
                                                                                    &quot;{item.customization.text}&quot;
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <p className="font-medium">
                                                                            {formatPrice(item.price)}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="flex items-center justify-between pt-4 border-t">
                                                                <p className="text-sm text-muted-foreground">
                                                                    {order.items.length} item(s)
                                                                </p>
                                                                <p className="font-semibold">
                                                                    Total: {formatPrice(order.total)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === "profile" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Name
                                            </label>
                                            <p className="text-lg">{user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </label>
                                            <p className="text-lg">{user.email}</p>
                                        </div>
                                        <div className="pt-4">
                                            <p className="text-sm text-muted-foreground">
                                                Profile editing coming soon...
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
