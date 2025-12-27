"use client";

import { useState, useEffect } from "react";

export default function PreviewCanvas({ svgContent, className = "" }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !svgContent) {
        return (
            <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
                <p className="text-muted-foreground">Preview loading...</p>
            </div>
        );
    }

    return (
        <div
            className={`bg-white rounded-lg border shadow-sm flex items-center justify-center p-8 ${className}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
}
