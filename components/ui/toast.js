"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);

    const addToast = React.useCallback((toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { id, ...toast };
        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration || 5000);

        return id;
    }, []);

    const removeToast = React.useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = React.useCallback(
        (options) => {
            if (typeof options === "string") {
                return addToast({ message: options, variant: "default" });
            }
            return addToast(options);
        },
        [addToast]
    );

    toast.success = React.useCallback(
        (message, options = {}) => addToast({ ...options, message, variant: "success" }),
        [addToast]
    );

    toast.error = React.useCallback(
        (message, options = {}) => addToast({ ...options, message, variant: "error" }),
        [addToast]
    );

    toast.info = React.useCallback(
        (message, options = {}) => addToast({ ...options, message, variant: "info" }),
        [addToast]
    );

    toast.warning = React.useCallback(
        (message, options = {}) => addToast({ ...options, message, variant: "warning" }),
        [addToast]
    );

    return (
        <ToastContext.Provider value={{ toast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

const variantStyles = {
    default: "bg-background border",
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
};

const variantIcons = {
    default: Info,
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

function Toast({ toast, onClose }) {
    const Icon = variantIcons[toast.variant || "default"];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "pointer-events-auto rounded-lg shadow-lg p-4 flex items-start gap-3",
                variantStyles[toast.variant || "default"]
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
                <div className="text-sm">{toast.message}</div>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}

export { Toast };
