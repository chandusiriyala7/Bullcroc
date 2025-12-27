"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const router = useRouter();

    useEffect(() => {
        if (!orderId) {
            router.push('/');
        }
    }, [orderId]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center">
                    <div className="mb-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground mb-6">
                        Thank you for your order. We'll start processing it right away.
                    </p>
                    {orderId && (
                        <div className="bg-muted p-4 rounded-lg mb-6">
                            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                            <p className="font-mono font-semibold">
                                #{orderId.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    )}
                    <div className="space-y-3">
                        <Link href="/account" className="block">
                            <Button className="w-full">View Order History</Button>
                        </Link>
                        <Link href="/" className="block">
                            <Button variant="outline" className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
