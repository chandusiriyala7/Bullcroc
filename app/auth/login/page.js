"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthSwitch from "@/components/ui/auth-switch";
import Image from "next/image";

function LoginContent() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AuthSwitch redirect={redirect} />
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex w-full relative">
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-zinc-50" />
                {/* Optional: Add a subtle background pattern or image here */}
                {/* <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opcode-40" /> */}
            </div>

            <div className="relative z-10 w-full flex items-center justify-center p-4">
                <Suspense fallback={
                    <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
                    </div>
                }>
                    <LoginContent />
                </Suspense>
            </div>
        </div>
    );
}
