// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarClock,
    Users2,
    MessageSquareText,
    BarChart3,
    Settings,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NAV = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/appointments", label: "Appointments", icon: CalendarClock },
    { href: "/clients", label: "Clients", icon: Users2 },
    { href: "/messages", label: "Messages", icon: MessageSquareText },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card/40">
            <div className="p-4 text-lg font-semibold">SmartMatePro</div>
            <Separator />
            <nav className="flex-1 p-3 space-y-1">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link key={href} href={href}>
                            <div
                                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 text-xs text-muted-foreground">v0.1.0 — local</div>
        </aside>
    );
}
