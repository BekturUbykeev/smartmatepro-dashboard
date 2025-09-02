"use client";

import MetricsTabs from "@/components/dashboard/MetricsTabs";      // твой переключатель диапазонов
import KpiRow from "@/components/dashboard/KpiRow";               // ← НОВОЕ
import TopHoursCard from "@/components/dashboard/TopHoursCard";
import UpcomingList from "@/components/dashboard/UpcomingList";   // если есть

export default function DashboardPage() {
    return (
        <div className="px-6 py-6 space-y-6">
            <MetricsTabs />

            {/* KPI-плитки вместо «пустых» блоков */}
            <KpiRow />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopHoursCard />
                <UpcomingList />
            </div>
        </div>
    );
}
