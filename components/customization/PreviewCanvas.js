"use client";

import { useState, useEffect } from "react";

export default function PreviewCanvas({ svgContent, backgroundImage, className = "" }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
                <p className="text-muted-foreground">Preview loading...</p>
            </div>
        );
    }

    return (
        <div className={`relative bg-slate-50 rounded-lg border shadow-sm overflow-hidden flex items-center justify-center p-8 ${className}`}>
            {/* Background Image Layer */}
            {backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={backgroundImage}
                        alt="Product Preview"
                        className="w-full h-full object-contain opacity-90"
                    />
                </div>
            )}

            {/* SVG Content Layer */}
            {svgContent ? (
                <div
                    className="relative z-10 drop-shadow-xl"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            ) : (
                <p className="relative z-10 text-muted-foreground">Start customizing to see preview</p>
            )}
        </div>
    );
}
