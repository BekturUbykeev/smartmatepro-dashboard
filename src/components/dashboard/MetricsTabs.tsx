// src/components/dashboard/MetricsTabs.tsx
"use client";

import { useState } from "react";
import { useDashboardMetrics } from "@/app/hooks/useDashboardMetrics";
import { hours, pct } from "@/lib/metrics";
import UtilizationSparkline from "@/components/dashboard/UtilizationSparkline";
import TopHoursBar from "@/components/dashboard/TopHoursBar";

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="mt-1 text-3xl font-semibold">{value}</div>
            {sub ? <div className="mt-1 text-xs text-gray-400">{sub}</div> : null}
        </div>
    );
}

export default function MetricsTabs() {
    const [tab, setTab] = useState<"week" | "today" | "mtd">("week");
    const { today, week, mtd, loading } = useDashboardMetrics();

    const tabs = [
        { key: "week" as const, label: "Next 7 days" },
        { key: "today" as const, label: "Today" },
        { key: "mtd" as const, label: "Month-to-date" },
    ];

    const data = tab === "week" ? week : tab === "today" ? today : mtd;

    return (
        <div className="space-y-8">
            {/* Tabs header */}
            <div className="inline-flex rounded-full border bg-white p-1 shadow-sm">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-sm rounded-full transition ${tab === t.key ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Metric cards */}
            {loading || !data ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card
                        title="Appointments"
                        value={`${data.appointments}`}
                        sub={`${hours(data.bookedMinutes)}h booked`}
                    />
                    <Card
                        title="Utilization"
                        value={pct(data.utilization)}
                        sub={`${hours(data.capacityMinutes)}h capacity`}
                    />
                    <Card
                        title="Clients"
                        value={`${data.uniqueClients}`}
                        sub={tab !== "today" ? `${data.newClients} new · ${data.returningClients} returning` : undefined}
                    />
                        {tab === "today" ? (
                            <Card
                                title="Free slots"
                                value={`${today?.freeSlots ?? 0}/${today?.totalSlots ?? 0}`}
                                sub={`Utilization ${pct(today!.utilization || 0)}`}
                            />
                        ) : tab === "mtd" ? (
                            <Card
                                title="Cancellation rate"
                                value={pct(mtd!.cancellationRate)}
                                sub={`${mtd!.cancelledAppointments} cancelled`}
                            />
                        ) : (
                            <Card
                                title="Avg. daily util."
                                value={pct((week ?? data)!.utilization)}
                                sub={
                                    tab === "week" && week
                                        ? `Range ${new Date(week.startISO).toLocaleDateString()}–${new Date(week.endISO).toLocaleDateString()}`
                                        : undefined
                                }
                            />
                        )}
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UtilizationSparkline />
                <TopHoursBar />
            </div>
        </div>
    );
}
