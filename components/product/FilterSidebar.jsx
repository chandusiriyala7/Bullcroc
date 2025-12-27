"use client";

import { motion } from "framer-motion";
import { Check, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const FilterSidebar = ({
    categories,
    selectedCategories,
    onCategoryChange,
    sortBy,
    onSortChange,
    className
}) => {
    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between lg:hidden mb-4">
                {/* Mobile Filter Trigger handled by parent or a separate mobile bar */}
            </div>

            {/* Desktop Filters */}
            <div className="space-y-6">
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </h3>

                    <Accordion type="single" collapsible defaultValue="category" className="w-full">
                        <AccordionItem value="category" className="border-b-0">
                            <AccordionTrigger className="hover:no-underline py-2">Category</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2">
                                    {categories.map((category) => (
                                        <label
                                            key={category.value}
                                            className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200",
                                                selectedCategories[category.value]
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "border-muted-foreground/30 group-hover:border-primary/50"
                                            )}>
                                                {selectedCategories[category.value] && (
                                                    <Check className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedCategories[category.value] || false}
                                                onChange={(e) => onCategoryChange(category.value, e.target.checked)}
                                            />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {category.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4" /> Sort By
                    </h3>
                    <div className="space-y-2">
                        {[
                            { label: "Price: Low to High", value: "asc" },
                            { label: "Price: High to Low", value: "dsc" },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200",
                                    sortBy === option.value
                                        ? "border-primary"
                                        : "border-muted-foreground/30 group-hover:border-primary/50"
                                )}>
                                    {sortBy === option.value && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    name="sortBy"
                                    className="hidden"
                                    value={option.value}
                                    checked={sortBy === option.value}
                                    onChange={(e) => onSortChange(e.target.value)}
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MobileFilterDrawer = ({
    categories,
    selectedCategories,
    onCategoryChange,
    sortBy,
    onSortChange,
}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden w-full flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters & Sort
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search</SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                    <FilterSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={onCategoryChange}
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default FilterSidebar;
