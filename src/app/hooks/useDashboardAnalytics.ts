// src/app/hooks/useDashboardAnalytics.ts
"use client";
import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import { useEvents } from "./useEvents";
import {
    dailyMetrics,
    generateSlotsForDay,
    type SlotConfig,
    type EventItem,
} from "@/lib/metrics";

const CFG: SlotConfig = { timezone: "America/Los_Angeles", dayStartHour: 10, dayEndHour: 18, slotMinutes: 120 };

// ---- Utilization 7 дней
export function useSevenDayUtilization() {
    const ue: any = useEvents();
    const events: EventItem[] = ue?.events ?? ue?.data ?? [];
    const isLoading: boolean = !!(ue?.isLoading ?? ue?.loading ?? (ue?.status === "loading"));

    return useMemo(() => {
        if (isLoading || events == null) {
            return { loading: true as const, points: [] as { date: string; util: number }[] };
        }
        const now = DateTime.now().setZone(CFG.timezone).startOf("day");
        const points: { date: string; util: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = now.minus({ days: i });
            const m = dailyMetrics(events, d, CFG);
            points.push({ date: d.toFormat("LLL d"), util: Math.round(m.utilization * 100) });
        }
        return { loading: false as const, points };
    }, [isLoading, events.length]);
}

// ---- Top hours
export function useTopHours() {
    const ue: any = useEvents();
    const events: EventItem[] = ue?.events ?? ue?.data ?? [];
    const isLoading: boolean = !!(ue?.isLoading ?? ue?.loading ?? (ue?.status === "loading"));

    return useMemo(() => {
        if (isLoading || events == null) {
            return { loading: true as const, bars: [] as { label: string; minutes: number }[] };
        }
        const day = DateTime.now().setZone(CFG.timezone).startOf("day");
        const slots = generateSlotsForDay(day, CFG);               // 10–12, 12–14, 14–16, 16–18
        const buckets = slots.map(() => 0);

        for (const e of events) {
            const s = DateTime.fromISO(e.start, { zone: CFG.timezone });
            const end = DateTime.fromISO(e.end, { zone: CFG.timezone });
            const int = Interval.fromDateTimes(s, end);
            slots.forEach((slot, idx) => {
                const inter = slot.intersection(int);
                if (inter) buckets[idx] += inter.length("minutes");
            });
        }

        const bars = slots.map((slot, idx) => ({
            label: `${slot.start.toFormat("h a")}–${slot.end.toFormat("h a")}`,
            minutes: buckets[idx],
        }));
        return { loading: false as const, bars };
    }, [isLoading, events.length]);
}
