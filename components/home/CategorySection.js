"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const categories = [
    {
        id: 1,
        name: "Name Plates",
        slug: "name-plates",
        description: "Personalized name plates for homes and offices",
        image: "/categories/nameplate.svg",
    },
    {
        id: 2,
        name: "Metal Letters",
        slug: "metal-letters",
        description: "Premium metal letters for signage",
        image: "/categories/metal-letters.svg",
    },
    {
        id: 3,
        name: "Neon Signs",
        slug: "neon-signs",
        description: "Custom neon light signs for any space",
        image: "/categories/neon-signs.svg",
    },
];

export default function CategorySection() {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Explore Our Categories
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose from our premium collection of customizable signage products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Link href={`/category/${category.slug}`}>
                                <Card hover={true} className="overflow-hidden group cursor-pointer">
                                    <div className="relative h-64 overflow-hidden bg-muted">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{
                                                backgroundImage: `url(${category.image})`,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-sm text-white/90">{category.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
