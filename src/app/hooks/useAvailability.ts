"use client";

import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import type { EventItem } from "./useEvents";
import { TZ, dt } from "@/lib/tz";


// Рабочий день: 10:00–18:00 (end-эксклюзив), шаг 2 часа.
// Слоты: 10–12, 12–14, 14–16, 16–18.
export function useAvailability(dateISO: string | null, events: EventItem[]) {
    return useMemo(() => {
        if (!dateISO) return [];
        const day = dt(dateISO).startOf("day");
        const workStart = day.set({ hour: 10, minute: 0 });
        const workEnd = day.set({ hour: 18, minute: 0 });

        const slots: { start: DateTime; end: DateTime }[] = [];
        let cursor = workStart;
        const step = { hours: 2 };

        while (cursor < workEnd) {
            const next = cursor.plus(step);
            if (next <= workEnd) slots.push({ start: cursor, end: next });
            cursor = next;
        }

        const busy = events.map(e =>
            Interval.fromDateTimes(
                dt(e.start),
                dt(e.end),
            )
        );

        return slots.filter(s =>
            busy.every(b => !b.overlaps(Interval.fromDateTimes(s.start, s.end)))
        );
    }, [dateISO, events]);
}
