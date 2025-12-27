import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
