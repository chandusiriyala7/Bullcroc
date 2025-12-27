import { CheckCircle2, Truck, Palette, Shield } from "lucide-react";

const features = [
    {
        icon: Palette,
        title: "Expert Customization",
        description: "Real-time preview with unlimited design possibilities",
    },
    {
        icon: CheckCircle2,
        title: "Premium Quality",
        description: "High-grade materials and precision craftsmanship",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Quick turnaround with secure packaging",
    },
    {
        icon: Shield,
        title: "Quality Guarantee",
        description: "100% satisfaction with every order",
    },
];

export default function TrustSection() {
    return (
        <section className="py-16 bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose Bullcroc?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We deliver premium customized signage with unmatched quality and service
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
