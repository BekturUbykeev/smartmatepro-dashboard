"use client";
import { useDashboardMetrics } from "@/app/hooks/useDashboardMetrics";

export default function AppointmentsCard() {
    const { data, isLoading, isError } = useDashboardMetrics();

    if (isLoading) {
        return <div className="h-24 animate-pulse rounded-xl bg-black/5" />;
    }
    if (isError || !data) {
        return (
            <div className="rounded-xl border p-6 text-sm text-red-600">
                Failed to load metrics
            </div>
        );
    }

    return (
        <div className="rounded-xl border p-6 bg-white">
            <div className="text-sm text-muted-foreground">Appointments (next 7 days)</div>
            <div className="mt-1 text-3xl font-semibold">{data.appointmentsNext7}</div>
            <div className="mt-2 text-xs text-muted-foreground">
                Today: {data.appointmentsToday} · Utilization: {(data.utilizationNext7 * 100).toFixed(0)}%
            </div>
        </div>
    );
}
