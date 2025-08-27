// src/app/(app)/layout.tsx
'use client';
import type { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { ToasterProvider } from '@/components/ui/toast';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <ToasterProvider>
            <div className="min-h-screen bg-gray-50 grid grid-cols-[240px_1fr]">
                <Sidebar />
                <main className="flex min-h-screen flex-col">
                    <Topbar />
                    <div className="mx-auto w-full max-w-screen-2xl p-6">{children}</div>
                </main>
            </div>
        </ToasterProvider>
    );
}
