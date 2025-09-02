"use client";
import { ReactNode, useEffect } from "react";

export default function Modal({
    open,
    onClose,
    children,
    title,
}: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
                {title && <div className="mb-2 text-lg font-semibold">{title}</div>}
                {children}
            </div>
        </div>
    );
}
