import TopProducts from "@/components/home/TopProducts";
import VerticalCardProduct from "@/components/home/VerticalCardProduct";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import { BackgroundPaths } from "@/components/ui/background-paths";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getProductImages() {
    try {
        await connectDB();
        const products = await Product.find({}).select('productImage').limit(20);
        const images = products
            .map(p => p.productImage?.[0])
            .filter(Boolean)
            .map(src => ({ src, alt: 'Product Image' }));
        return images;
    } catch (error) {
        console.error("Failed to fetch product images:", error);
        return [];
    }
}

export default async function Home() {
    const images = await getProductImages();
    const fallbackImages = [
        'https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1754769440490-2eb64d715775?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1758640920659-0bb864175983?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1758367454070-731d3cc11774?w=600&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=600&auto=format&fit=crop&q=60'
    ].map(src => ({ src }));

    const galleryImages = images.length > 3 ? images : fallbackImages;

    return (
        <div className="min-h-screen bg-background">
            {/* 3D Gallery Hero Section with Background Paths */}
            <div className="relative h-screen w-full overflow-hidden text-center">
                <BackgroundPaths title="BullCroc">
                    <InfiniteGallery
                        images={galleryImages}
                        speed={1.5}
                        zSpacing={3}
                        visibleCount={12}
                        falloff={{ near: 0.8, far: 14 }}
                        className="h-full w-full"
                    />
                </BackgroundPaths>

                {/* Instructions */}
                <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none z-30">
                    <p className="font-mono uppercase text-xs font-semibold text-white/50">
                        Use mouse wheel or touch to navigate
                    </p>
                </div>
            </div>

            {/* Main Content - Full Width */}
            <div className="w-full px-4 lg:px-6 py-12">
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
