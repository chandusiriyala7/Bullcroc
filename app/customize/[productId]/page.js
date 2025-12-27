import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NamePlateEditor from "@/components/customization/NamePlateEditor";

// This would normally fetch from database
const mockProduct = {
    _id: "1",
    name: "Custom Name Plate",
    basePrice: 999,
    description: "Premium quality custom name plate",
    category: "name-plates",
};

export default function CustomizePage({ params }) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <NamePlateEditor product={mockProduct} />
                </div>
            </main>
            <Footer />
        </>
    );
}
