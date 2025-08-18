// src/components/layout/topbar.tsx
"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { useState } from "react";

export default function Topbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                {/* Mobile: slide-out sidebar */}
                <div className="md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="font-medium">Dashboard</div>

                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
