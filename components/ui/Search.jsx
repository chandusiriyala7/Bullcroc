"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function Search() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchSuggestions = async (searchTerm) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/search-suggest?q=${encodeURIComponent(searchTerm)}`);
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.suggestions);
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mx-auto ">
            <form onSubmit={handleSearch} className="relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name plates, neon signs..."
                    className="w-full h-10 pl-10 pr-10 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:bg-white/20 focus:border-white/20 transition-all text-sm backdrop-blur-sm"
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setSuggestions([]); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {isOpen && (suggestions.length > 0 || loading) && (
                <div className="absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                    {loading ? (
                        <div className="p-4 flex items-center justify-center text-gray-400">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            <span className="text-sm">Searching...</span>
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="px-3 pb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Suggestions
                            </div>
                            {suggestions.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/product/${product._id}`} // Assuming product details page structure
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="h-10 w-10 rounded bg-gray-800 overflow-hidden flex-shrink-0 border border-white/5">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-600 text-xs">IMG</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{product.name}</h4>
                                        <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                                    </div>
                                    <div className="text-sm font-medium text-white">
                                        {formatPrice(product.price)}
                                    </div>
                                </Link>
                            ))}

                            <div className="border-t border-white/10 mt-1 pt-1">
                                <button
                                    onClick={handleSearch}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors"
                                >
                                    See all results for &quot;{query}&quot;
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
