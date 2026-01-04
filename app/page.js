import TopProducts from "@/components/home/TopProducts";
import VerticalCardProduct from "@/components/home/VerticalCardProduct";
import { HeroParallax } from "@/components/ui/hero-parallax";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getHeroProducts() {
    try {
        await connectDB();
        // Fetch products to populate the parallax (randomized)
        const products = await Product.aggregate([
            { $match: { productImage: { $exists: true, $not: { $size: 0 } } } }, // Ensure has images
            { $sample: { size: 15 } }
        ]);

        const validProducts = products.map(p => ({
            title: p.productName,
            link: `/product/${p._id}`,
            thumbnail: p.productImage?.[0]?.replace('http://', 'https://')
        }));

        return validProducts;
    } catch (error) {
        console.error("Failed to fetch products for hero:", error);
        return [];
    }
}

// Hero Parallax Home Page
export default async function Home() {
    let products = await getHeroProducts();

    // Fallback if not enough products
    if (products.length < 10) {
        const fallbackProducts = [
            { title: "Neon Vibes", link: "/product-category?category=NeonLightsSign", thumbnail: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=60" },
            { title: "Metal Art", link: "/product-category?category=MetalLetters", thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=60" },
            { title: "Custom Names", link: "/product-category?category=NamePlates", thumbnail: "https://images.unsplash.com/photo-1533158657152-c0cb4a520977?w=600&auto=format&fit=crop&q=60" },
            { title: "Luxury Decor", link: "/", thumbnail: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600&auto=format&fit=crop&q=60" },
            { title: "Modern Design", link: "/", thumbnail: "https://images.unsplash.com/photo-1540573133985-cd8752cf3753?w=600&auto=format&fit=crop&q=60" },
            { title: "Elegant Signs", link: "/", thumbnail: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=60" },
            { title: "Urban Style", link: "/", thumbnail: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&auto=format&fit=crop&q=60" },
            { title: "Classic Finish", link: "/", thumbnail: "https://images.unsplash.com/photo-1534349762913-577363fde833?w=600&auto=format&fit=crop&q=60" },
            { title: "Bold Statement", link: "/", thumbnail: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=600&auto=format&fit=crop&q=60" },
            { title: "Creative Space", link: "/", thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60" },
        ];
        products = [...products, ...fallbackProducts].slice(0, 15);
    }

    return (
        <div className="min-h-screen bg-background">
            <HeroParallax products={products} />

            {/* Main Content - Full Width */}
            <div className="w-full px-4 lg:px-6 py-12 relative z-10 bg-background">
                <TopProducts heading="Top Products" />

                <VerticalCardProduct
                    category="NamePlates"
                    heading="Name Plates"
                />

                <VerticalCardProduct
                    category="NeonLightsSign"
                    heading="Neon Lights Sign"
                />

                <VerticalCardProduct
                    category="MetalLetters"
                    heading="Metal Letters"
                />
            </div>
        </div>
    );
}
