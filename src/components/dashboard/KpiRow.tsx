"use client";

import { useDashboardMetrics } from "@/app/hooks/useDashboardMetrics";

function Card({
    title,
    value,
    sub,
}: { title: string; value: React.ReactNode; sub?: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-white p-6">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="mt-1 text-3xl font-semibold">{value}</div>
            {sub ? <div className="mt-2 text-xs text-muted-foreground">{sub}</div> : null}
        </div>
    );
}

export default function KpiRow() {
    const { data, isLoading, isError } = useDashboardMetrics();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="h-24 animate-pulse rounded-xl bg-black/5" />
                <div className="h-24 animate-pulse rounded-xl bg-black/5" />
                <div className="h-24 animate-pulse rounded-xl bg-black/5" />
                <div className="h-24 animate-pulse rounded-xl bg-black/5" />
            </div>
        );
    }
    if (isError || !data) {
        return <div className="rounded-xl border p-6 text-sm text-red-600">Failed to load metrics</div>;
    }

    const bookedH = (data.bookedMinutesNext7 / 60).toFixed(1);
    const capacityH = (data.capacityMinutesNext7 / 60).toFixed(1);
    const utilPct = `${(data.utilizationNext7 * 100).toFixed(0)}%`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card
                title="Appointments (next 7 days)"
                value={data.appointmentsNext7}
                sub={`Today: ${data.appointmentsToday}`}
            />
            <Card
                title="Booked hours (next 7 days)"
                value={bookedH}
                sub={`Capacity: ${capacityH}h`}
            />
            <Card
                title="Utilization (next 7 days)"
                value={utilPct}
                sub={`${bookedH}h / ${capacityH}h`}
            />
            {/* если появятся клиенты — добавим здесь
      <Card title="Clients" value="—" sub="0 new · 0 returning" />
      */}
        </div>
    );
}
