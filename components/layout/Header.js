"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Search from "@/components/ui/Search";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const router = useRouter();
    const pathname = usePathname();

    // Hide Header on Admin Dashboard routes
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navLinks = [
        { name: "All Products", href: "/product-category?category=NamePlates" }, // Updated to generic
        { name: "Contact", href: "#contact" },
    ];

    return (
        <header className='fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-black/80 border-b border-white/10 shadow-lg'>
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between h-16 gap-4'>
                    {/* Logo - Flex shrink 0 to prevent shrinking */}
                    <Link href="/" className='flex items-center flex-shrink-0'>
                        <img
                            src="/bullcroc-logo.png"
                            alt="Bullcroc"
                            className='h-10 w-auto'
                        />
                    </Link>

                    {/* Search - Centered and flexible width */}
                    <div className='hidden lg:block flex-1 max-w-xl mx-4'>
                        <Search />
                    </div>

                    {/* Right Side Actions & Navigation */}
                    <div className='hidden lg:flex items-center space-x-6 flex-shrink-0'>
                        {/* Navigation Links */}
                        <nav className='flex items-center space-x-6 mr-4'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className='text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium'
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Cart Icon */}
                        <Link href="/cart" className='relative text-white hover:text-gray-300 transition-colors'>
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Login/Logout Button */}
                        {user ? (
                            <div className='flex items-center space-x-4'>
                                {/* Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none">
                                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer border border-white/10">
                                            {user?.profilePic ? (
                                                <img src={user.profilePic} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                <span className="font-semibold text-sm">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-white">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                        {user?.role === 'ADMIN' ? (
                                            <DropdownMenuItem
                                                className="cursor-pointer focus:bg-zinc-800 focus:text-white"
                                                onClick={() => router.push('/admin/dashboard')}
                                            >
                                                Admin Dashboard
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                className="cursor-pointer focus:bg-zinc-800 focus:text-white"
                                                onClick={() => router.push('/account/orders')}
                                            >
                                                My Orders
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            className="cursor-pointer focus:bg-zinc-800 focus:text-white text-red-500 focus:text-red-500"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className='bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 text-sm font-medium'
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className='lg:hidden text-white'
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className='lg:hidden bg-black/80 backdrop-blur-md border-t border-white/10 py-4 h-screen absolute w-full left-0 top-16'>
                        <nav className='flex flex-col space-y-3'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className='text-white hover:text-gray-300 transition-colors duration-200 px-4 py-2'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <Link
                                href="/cart"
                                className='text-white hover:text-gray-300 transition-colors duration-200 px-4 py-2 flex items-center'
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Cart ({itemCount})
                            </Link>

                            <div className='px-4 pt-2'>
                                {user ? (
                                    <>
                                        <Link
                                            href="/account"
                                            className='block text-white hover:text-gray-300 py-2'
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Account
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className='w-full bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 text-sm font-medium mt-2'
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className='block w-full bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 text-sm font-medium text-center'
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
