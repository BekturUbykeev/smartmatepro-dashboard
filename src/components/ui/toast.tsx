// src/components/ui/toast.tsx
"use client";
import React from "react";

type Toast = { id: string; type: "success" | "error" | "info"; msg: string };

const Ctx = React.createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
    const [list, setList] = React.useState<Toast[]>([]);
    const push = (t: Omit<Toast, "id">) => {
        const id = `${Date.now()}_${Math.random()}`;
        setList(s => [...s, { ...t, id }]);
        setTimeout(() => setList(s => s.filter(x => x.id !== id)), 3000);
    };
    return (
        <Ctx.Provider value={{ push }}>
            {children}
            <div className="pointer-events-none fixed right-4 top-4 z-[9999] space-y-2">
                {list.map(t => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow
              ${t.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
                                t.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
                                    "bg-gray-50 border-gray-200 text-gray-800"}`}
                    >
                        {t.msg}
                    </div>
                ))}
            </div>
        </Ctx.Provider>
    );
}

export function useToast() {
    const ctx = React.useContext(Ctx);
    if (!ctx) throw new Error("useToast must be inside <ToasterProvider/>");
    return {
        success: (msg: string) => ctx.push({ type: "success", msg }),
        error: (msg: string) => ctx.push({ type: "error", msg }),
        info: (msg: string) => ctx.push({ type: "info", msg }),
    };
}
