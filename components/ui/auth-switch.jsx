"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthSwitch({ redirect = "/" }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(email, password);
            } else {
                result = await signup(name, email, password);
            }

            if (result.success) {
                toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
                router.push(redirect);
            } else {
                toast.error(result.error || (isLogin ? "Login failed" : "Signup failed"));
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200">
                {/* Header Toggle */}
                <div className="flex p-2 bg-zinc-50 border-b border-zinc-100">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                            isLogin
                                ? "bg-black text-white shadow-lg"
                                : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                        )}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                            !isLogin
                                ? "bg-black text-white shadow-lg"
                                : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                        )}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-zinc-500 mt-2 text-sm">
                            {isLogin
                                ? "Enter your credentials to access your account"
                                : "Join us to start your journey"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field (Signup only) */}
                        <div
                            className={cn(
                                "transition-all duration-300 overflow-hidden",
                                !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-400 text-zinc-900 font-medium"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-400 text-zinc-900 font-medium"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-400 text-zinc-900 font-medium"
                            />
                        </div>

                        {/* Forgot Password Link (Login only) */}
                        <div
                            className={cn(
                                "flex justify-end transition-all duration-300",
                                isLogin ? "max-h-6 opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <button
                                type="button"
                                className="text-xs font-medium text-zinc-500 hover:text-black transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white h-12 rounded-xl font-bold text-sm tracking-wide hover:bg-zinc-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-black/20"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                        <p className="text-zinc-500 text-xs">
                            By continuing, you agree to our{" "}
                            <a href="#" className="underline hover:text-black text-zinc-600">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline hover:text-black text-zinc-600">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
