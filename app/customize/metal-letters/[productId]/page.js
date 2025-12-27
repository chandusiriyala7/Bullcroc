import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetalLettersEditor from "@/components/customization/MetalLettersEditor";

// This would normally fetch from database
const mockProduct = {
    _id: "2",
    name: "Custom Metal Letters",
    basePrice: 1499,
    description: "Premium quality metal letters with professional finish",
    category: "metal-letters",
};

export default function MetalLettersPage({ params }) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <MetalLettersEditor product={mockProduct} />
                </div>
            </main>
            <Footer />
        </>
    );
}
