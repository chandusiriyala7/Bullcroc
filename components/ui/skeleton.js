import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    );
}

function SkeletonProductCard() {
    return (
        <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
            <Skeleton className="h-64 w-full" />
            <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}

export { Skeleton, SkeletonCard, SkeletonProductCard };
