"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Plus, Edit, Trash2, Search, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products);
            }
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTopProduct = async (product) => {
        setToggling(product._id);
        const newValue = !product.isTopProduct;

        try {
            const response = await fetch(`/api/admin/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isTopProduct: newValue }),
            });

            if (response.ok) {
                toast.success(newValue ? "Added to Top Products" : "Removed from Top Products");
                // Optimistic update
                setProducts(products.map(p =>
                    p._id === product._id ? { ...p, isTopProduct: newValue } : p
                ));
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            toast.error("Failed to update product");
        } finally {
            setToggling(null);
        }
    };

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setDeleting(productId);
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Product deleted successfully");
                fetchProducts();
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setDeleting(null);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product catalog
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Products List */}
            <Card>
                <CardContent className="p-6">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                {search ? 'No products found matching your search.' : 'No products found. Create your first product to get started.'}
                            </p>
                            {!search && (
                                <Link href="/admin/products/new">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Product
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{product.name}</h3>
                                        <div className="flex items-center gap-2 mb-1">
                                            {product.isTopProduct && (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                                                    <Star className="w-3 h-3 mr-1 fill-yellow-800" /> Top Product
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {product.description}
                                        </p>
                                        <p className="text-sm font-medium mt-1">
                                            {formatPrice(product.sellingPrice || product.basePrice)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleTopProduct(product)}
                                            disabled={toggling === product._id}
                                            title={product.isTopProduct ? "Remove from Top Products" : "Add to Top Products"}
                                        >
                                            <Star className={`h-4 w-4 ${product.isTopProduct ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                                        </Button>
                                        <Link href={`/admin/products/${product._id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(product._id)}
                                            disabled={deleting === product._id}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
