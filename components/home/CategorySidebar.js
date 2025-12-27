"use client";

import { useRouter } from "next/navigation";

const sections = [
    {
        title: 'Name Plates',
        query: 'NamePlates',
        items: [
            'Acrylic Name Plate',
            'ACP Name Plate',
            'Metal Name Plate',
            'Office Desk Name Plate',
            'Wooden Name Plate',
            'Acrylic Engraving Name Plate',
            'Stainless Steel Etching Name Plate',
            'Acrylic UV Print Name Plate',
            'Decorative NamePlates',
            'Monogram NamePlates',
        ],
    },
    {
        title: 'Metal Letters',
        query: 'MetalLetters',
        items: [
            'SS Gold Mirror',
            'SS Gold Matt',
            'SS Silver Mirror',
            'SS Silver Matt',
            'SS Rose Gold Mirror',
            'SS Rose Gold Matt',
            'SS Powder Coated',
            'SS Trim type',
        ],
    },
    {
        title: 'Neon Lights Sign',
        query: 'NeonLightsSign',
        items: [
            'Customized Your Neon Sign',
            'Shop Neon Sign',
            'Funky Neon Sign',
            'Upload Your Own Design',
        ],
    },
    { title: 'Home Décor', query: 'HomeDecor', items: [] },
    { title: 'Personalized Gifts', query: 'PersonalizedGifts', items: [] },
    { title: 'Carving Items', query: 'CarvingItems', items: [] },
];

export default function CategorySidebar() {
    const router = useRouter();

    const goToCategory = (query) => {
        if (!query) return;
        router.push(`/product-category?category=${encodeURIComponent(query)}`);
    };

    return (
        <aside className="sticky top-28 hidden lg:block w-full">
            <div className="rounded-2xl bg-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 backdrop-blur-md overflow-hidden min-h-[calc(100vh-8rem)]">
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-none">
                    {sections.map((sec) => (
                        <div key={sec.title} className="mb-5 last:mb-0">
                            <button
                                onClick={() => goToCategory(sec.query)}
                                className="w-full text-left text-base font-semibold tracking-wide text-slate-800 hover:text-slate-900 transition-colors flex items-center"
                                aria-label={`Go to ${sec.title}`}
                            >
                                <span className="inline-block bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                                    {sec.title}
                                </span>
                            </button>
                            {sec.items.length > 0 && (
                                <ul className="mt-3 space-y-1.5">
                                    {sec.items.map((item) => (
                                        <li key={item}>
                                            <button
                                                onClick={() => goToCategory(sec.query)}
                                                className="w-full text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors rounded-lg py-1.5 px-2"
                                                aria-label={`Filter ${sec.title} by ${item}`}
                                            >
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
