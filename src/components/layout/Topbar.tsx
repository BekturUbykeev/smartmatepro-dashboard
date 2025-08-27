"use client";

import { Bell } from "lucide-react";

export default function Topbar() {
    return (
        <div className="flex items-center justify-between border-b bg-white px-6 py-3">
            <div className="text-sm text-gray-500">SmartMate Pro Dashboard</div>
            <div className="flex items-center gap-3">
                <button className="rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                    <Bell size={18} />
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}
