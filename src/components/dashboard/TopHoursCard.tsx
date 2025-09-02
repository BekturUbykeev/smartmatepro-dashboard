// src/components/dashboard/TopHoursCard.tsx
"use client";

import { useMemo } from "react";
import { useDashboardMetrics } from "@/app/hooks/useDashboardMetrics";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "@/components/charts/RechartsClient";

export default function TopHoursCard() {
    const { data, isLoading, isError } = useDashboardMetrics();

    // 👇 Хук вызывается всегда, даже когда data ещё нет
    const series = useMemo(() => {
        const src = data?.topHours ?? [];
        return src.map(({ hour, count }) => ({ label: `${hour}:00`, count }));
    }, [data?.topHours]);

    if (isLoading) return <div className="h-48 animate-pulse rounded-xl bg-black/5" />;
    if (isError || !data)
        return (
            <div className="rounded-xl border p-6 text-sm text-red-600">
                Failed to load metrics
            </div>
        );

    if (series.length === 0) {
        return (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                No activity in the next 7 days.
            </div>
        );
    }

    return (
        <div className="rounded-xl border p-4 bg-white">
            <div className="px-2 pt-2 text-sm text-muted-foreground">
                Top hours (next 7 days)
            </div>
            <div className="h-48">
                <ResponsiveContainer>
                    <BarChart data={series}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
