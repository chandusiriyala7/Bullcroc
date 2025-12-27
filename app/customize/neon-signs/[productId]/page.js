import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NeonSignsEditor from "@/components/customization/NeonSignsEditor";

// This would normally fetch from database
const mockProduct = {
    _id: "3",
    name: "Custom Neon Sign",
    basePrice: 2499,
    description: "Vibrant custom neon signs with professional glow effect",
    category: "neon-signs",
};

export default function NeonSignsPage({ params }) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <NeonSignsEditor product={mockProduct} />
                </div>
            </main>
            <Footer />
        </>
    );
}
