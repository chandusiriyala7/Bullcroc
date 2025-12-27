"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = ({ isOpen, onClose, children, className }) => {
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={cn(
                                "relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg",
                                className
                            )}
                        >
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const ModalHeader = ({ children, className }) => (
    <div className={cn("mb-4", className)}>{children}</div>
);

const ModalTitle = ({ children, className }) => (
    <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
);

const ModalDescription = ({ children, className }) => (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
        {children}
    </p>
);

const ModalContent = ({ children, className }) => (
    <div className={cn("mb-4", className)}>{children}</div>
);

const ModalFooter = ({ children, className }) => (
    <div className={cn("flex justify-end gap-2", className)}>{children}</div>
);

const ModalClose = ({ onClose, className }) => (
    <button
        onClick={onClose}
        className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
            className
        )}
    >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
    </button>
);

export {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter,
    ModalClose,
};
