"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    const pathname = usePathname();

    // Hide Footer on Admin Dashboard routes
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer id="contact" className="bg-black/80 backdrop-blur-md text-white pt-16 pb-8 border-t border-white/10">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Contact Us */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                        <div className="space-y-2 text-gray-400 text-sm">
                            <p>No.77, Moorthy Street, Avadi to Poovai</p>
                            <p>Road, Chennai, Tamilnadu - 600071</p>
                        </div>
                        <div className="space-y-1 text-gray-400 text-sm mt-4">
                            <p>+91 73050 28841</p>
                            <p>+91 96000 40232</p>
                            <p>044-35078028</p>
                        </div>
                    </div>

                    {/* Our Products */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6">Our Products</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/product-category?category=NeonLightsSign" className="hover:text-white transition-colors">Neon Nameplates</Link></li>
                            <li><Link href="/product-category?category=MetalLetters" className="hover:text-white transition-colors">Metal Nameplates</Link></li>
                            <li><Link href="/product-category?category=NamePlates" className="hover:text-white transition-colors">Custom Nameboards</Link></li>
                            <li><Link href="/product-category?category=HomeDecor" className="hover:text-white transition-colors">Signage Solutions</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/customization" className="hover:text-white transition-colors">Customization</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Subscribe */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6">Subscribe</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Get updates on our latest products and offers.
                        </p>
                        <form className="flex w-full mb-6">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#1e2330] text-gray-300 px-4 py-2 text-sm rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                            <button
                                type="submit"
                                className="bg-white text-black px-4 py-2 text-sm font-medium rounded-r-md hover:bg-gray-200 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                        <div className="flex justify-end gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaFacebookF /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaInstagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaTwitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-400 text-sm mb-2">
                        Your trusted partner for <span className="text-white font-medium">customized nameboards, neon nameplates, and metal nameplates.</span>
                    </p>
                    <p className="text-gray-500 text-xs">
                        Copyright © 2024 Adzon Signage. All Rights Reserved
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Powered By Grexotix
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        Built By <span className="text-white">Chandusiriyala :)</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
