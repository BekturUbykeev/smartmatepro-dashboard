// ============================
// src/lib/metrics.ts
// ============================
import { DateTime, Interval } from "luxon";

// 1) Расширяем тип события
export type EventItem = {
    id: string;
    clientId?: string | null;
    title: string;
    start: string; // ISO
    end: string;   // ISO
    notes?: string;

    // NEW:
    status?: "pending" | "confirmed" | "cancelled" | "completed"; // ← для метрик
    createdAt?: string;
    source?: "manual" | "whatsapp" | "google";
};

// утилита
const isBookable = (e: EventItem) => e.status !== "cancelled";


export type SlotConfig = {
    timezone: string;               // e.g. "America/Los_Angeles"
    dayStartHour: number;           // e.g. 11 (11:00)
    dayEndHour: number;             // e.g. 19 (19:00)
    slotMinutes: number;            // e.g. 90 for 1.5h
};

export type DailyMetrics = {
    dateISO: string;                // day bucket start in tz
    appointments: number;
    bookedMinutes: number;          // merged busy minutes
    capacityMinutes: number;        // open *working* minutes that day
    utilization: number;            // 0..1
    totalSlots: number;
    freeSlots: number;
    uniqueClients: number;
};

// 2) Расширяем агрегаты диапазона
export type RangeMetrics = {
    startISO: string;
    endISO: string;                 // exclusive end
    appointments: number;           // НЕ включает отменённые
    bookedMinutes: number;          // только по неотменённым
    capacityMinutes: number;
    utilization: number;            // 0..1
    uniqueClients: number;

    // NEW:
    cancelledAppointments: number;
    cancellationRate: number;       // 0..1 (cancelled / total scheduled)
    newClients: number;
    returningClients: number;
};

const toDT = (iso: string, tz: string) => DateTime.fromISO(iso, { zone: tz });

export function workingIntervalFor(date: DateTime, cfg: SlotConfig): Interval {
    const start = date.set({ hour: cfg.dayStartHour, minute: 0, second: 0, millisecond: 0 });
    const end = date.set({ hour: cfg.dayEndHour, minute: 0, second: 0, millisecond: 0 });
    return Interval.fromDateTimes(start, end);
}

export function generateSlotsForDay(date: DateTime, cfg: SlotConfig) {
    const dayInt = workingIntervalFor(date, cfg);
    const slots: Interval[] = [];
    let cursor = dayInt.start;
    while (cursor < dayInt.end) {
        const next = cursor.plus({ minutes: cfg.slotMinutes });
        if (next > dayInt.end) break;
        slots.push(Interval.fromDateTimes(cursor, next));
        cursor = next;
    }
    return slots;
}

export function mergeBusyIntervals(events: EventItem[], cfg: SlotConfig, day?: DateTime) {
    const tz = cfg.timezone;
    let intervals = events.map((e) => Interval.fromDateTimes(toDT(e.start, tz), toDT(e.end, tz)));
    if (day) {
        const dayInt = workingIntervalFor(day, cfg);
        intervals = intervals
            .map((i) => i.intersection(dayInt))
            .filter((i): i is Interval => !!i);
    }
    // sort + merge
    intervals.sort((a, b) => a.start.toMillis() - b.start.toMillis());
    const merged: Interval[] = [];
    for (const int of intervals) {
        const last = merged[merged.length - 1];
        if (!last) { merged.push(int); continue; }
        if (last.overlaps(int) || last.abutsStart(int) || int.abutsStart(last)) {
            merged[merged.length - 1] = Interval.fromDateTimes(
                DateTime.min(last.start, int.start),
                DateTime.max(last.end, int.end)
            );
        } else {
            merged.push(int);
        }
    }
    return merged;
}

export function minutesOf(intervals: Interval[]) {
    return intervals.reduce((acc, i) => acc + i.length("minutes"), 0);
}

export function filterEventsByDay(events: EventItem[], day: DateTime, cfg: SlotConfig) {
    const dayInt = workingIntervalFor(day, cfg);
    return events.filter((e) => Interval.fromDateTimes(toDT(e.start, cfg.timezone), toDT(e.end, cfg.timezone)).overlaps(dayInt));
}

// 3) dailyMetrics — считаем только по неотменённым
export function dailyMetrics(events: EventItem[], day: DateTime, cfg: SlotConfig): DailyMetrics {
    const dayEventsAll = filterEventsByDay(events, day, cfg);
    const dayEvents = dayEventsAll.filter(isBookable); // ← исключаем cancelled

    const merged = mergeBusyIntervals(dayEvents, cfg, day);
    const capacityMinutes = workingIntervalFor(day, cfg).length("minutes");
    const bookedMinutes = minutesOf(merged);
    const utilization = capacityMinutes > 0 ? bookedMinutes / capacityMinutes : 0;

    const slots = generateSlotsForDay(day, cfg);
    const freeSlots = slots.filter((slot) => !merged.some((busy) => busy.overlaps(slot)));
    const uniqueClients = new Set(dayEvents.map((e) => e.clientId).filter(Boolean)).size;

    return {
        dateISO: day.startOf("day").toISO(),
        appointments: dayEvents.length,
        bookedMinutes,
        capacityMinutes,
        utilization,
        totalSlots: slots.length,
        freeSlots: freeSlots.length,
        uniqueClients,
    };
}

// 4) rangeMetrics — считаем отмены и rate
export function rangeMetrics(events: EventItem[], start: DateTime, end: DateTime, cfg: SlotConfig): RangeMetrics {
    // все события в диапазоне (любой статус)
    const inRangeAll = events.filter((e) => {
        const s = toDT(e.start, cfg.timezone);
        return s >= start && s < end;
    });

    // только неотменённые — для занятости/утил-ции
    const inRange = inRangeAll.filter(isBookable);

    // по дням: чтобы корректно учитывать capacity
    let bookedMinutes = 0;
    let capacityMinutes = 0;
    for (let d = start.startOf("day"); d < end; d = d.plus({ days: 1 })) {
        const dm = dailyMetrics(events, d, cfg); // уже исключает cancelled
        if (d >= start.startOf("day") && d < end) {
            bookedMinutes += dm.bookedMinutes;
            capacityMinutes += dm.capacityMinutes;
        }
    }
    const utilization = capacityMinutes > 0 ? bookedMinutes / capacityMinutes : 0;

    const uniqueClientsSet = new Set(inRange.map((e) => e.clientId).filter(Boolean));

    // новые / возвращающиеся (по первой дате появления)
    const firstSeen = new Map<string, DateTime>();
    for (const e of events) {
        if (!e.clientId) continue;
        const s = toDT(e.start, cfg.timezone);
        const prev = firstSeen.get(e.clientId);
        if (!prev || s < prev) firstSeen.set(e.clientId, s);
    }
    let newClients = 0;
    let returningClients = 0;
    for (const id of uniqueClientsSet) {
        const fs = firstSeen.get(id as string);
        if (fs && fs >= start && fs < end) newClients++; else returningClients++;
    }

    // NEW: отмены
    const cancelledAppointments = inRangeAll.filter((e) => e.status === "cancelled").length;
    const totalScheduled = inRangeAll.length; // включает и отменённые
    const cancellationRate = totalScheduled > 0 ? cancelledAppointments / totalScheduled : 0;

    return {
        startISO: start.toISO(),
        endISO: end.toISO(),
        appointments: inRange.length,
        bookedMinutes,
        capacityMinutes,
        utilization,
        uniqueClients: uniqueClientsSet.size,
        newClients,
        returningClients,
        cancelledAppointments,
        cancellationRate,
    };
}

// Helper formatters for UI
export function pct(n: number) { return `${Math.round(n * 100)}%`; }
export function hours(mins: number) { return (mins / 60).toFixed(1); }
