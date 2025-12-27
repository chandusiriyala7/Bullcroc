"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const val = Array.isArray(value) ? value[0] : value || 0

    const handleChange = (e) => {
        const newValue = Number(e.target.value)
        if (onValueChange) {
            // Support both single value and array (shadcn usually uses array)
            onValueChange([newValue])
        }
    }

    return (
        <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
            <input
                type="range"
                ref={ref}
                min={min}
                max={max}
                step={step}
                value={val}
                onChange={handleChange}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                {...props}
            />
        </div>
    )
})
Slider.displayName = "Slider"

export { Slider }
