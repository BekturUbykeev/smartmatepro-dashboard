// ============================
// src/components/dashboard/MetricsCards.tsx
// ============================
"use client";
import { hours, pct } from "@/lib/metrics";
import { useDashboardMetrics } from "@/app/hooks/useDashboardMetrics";

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="mt-1 text-3xl font-semibold">{value}</div>
            {sub ? <div className="mt-1 text-xs text-gray-400">{sub}</div> : null}
        </div>
    );
}

export default function MetricsCards() {
    const { today, week, mtd, loading } = useDashboardMetrics();
    if (loading || !today || !week || !mtd) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Today */}
            <div>
                <div className="mb-2 text-sm font-medium text-gray-500">Today</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card title="Appointments" value={`${today.appointments}`} sub={`${hours(today.bookedMinutes)}h booked`} />
                    <Card title="Free slots" value={`${today.freeSlots}/${today.totalSlots}`} sub={`Utilization ${pct(today.utilization)}`} />
                    <Card title="Unique clients" value={`${today.uniqueClients}`} />
                    <Card title="Capacity" value={`${hours(today.capacityMinutes)}h`} />
                </div>
            </div>

            {/* Next 7 days */}
            <div>
                <div className="mb-2 text-sm font-medium text-gray-500">Next 7 days</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card title="Appointments" value={`${week.appointments}`} sub={`${hours(week.bookedMinutes)}h booked`} />
                    <Card title="Utilization" value={pct(week.utilization)} sub={`${hours(week.capacityMinutes)}h capacity`} />
                    <Card title="Clients" value={`${week.uniqueClients}`} sub={`${week.newClients} new · ${week.returningClients} returning`} />
                    <Card title="Avg. daily util." value={`${pct(week.utilization)}`} sub={`Range ${new Date(week.startISO).toLocaleDateString()}–${new Date(week.endISO).toLocaleDateString()}`} />
                </div>
            </div>

            {/* Month to date */}
            <div>
                <div className="mb-2 text-sm font-medium text-gray-500">Month‑to‑date</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card title="Appointments" value={`${mtd.appointments}`} />
                    <Card title="Utilization" value={pct(mtd.utilization)} sub={`${hours(mtd.bookedMinutes)}h / ${hours(mtd.capacityMinutes)}h`} />
                    <Card title="Clients" value={`${mtd.uniqueClients}`} sub={`${mtd.newClients} new · ${mtd.returningClients} returning`} />
                    {/* Placeholder for future: cancellation rate / revenue */}
                    <Card title="Cancellation rate" value="—" sub="Add EventItem.status to enable" />
                </div>
            </div>
        </div>
    );
}