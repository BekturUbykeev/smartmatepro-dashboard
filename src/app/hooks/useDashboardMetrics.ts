"use client";
import { useQuery } from "@tanstack/react-query";

export type Overview = {
    start: string; end: string;
    appointmentsNext7: number;
    appointmentsToday: number;
    bookedMinutesNext7: number;
    capacityMinutesNext7: number;
    utilizationNext7: number;
    topHours: Array<{ hour: number; count: number }>;
};

export function useDashboardMetrics() {
    return useQuery<Overview>({
        queryKey: ["metrics", "overview"],
        queryFn: async () => {
            const res = await fetch("/api/metrics/overview", { cache: "no-store" });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        staleTime: 30_000,
    });
}
