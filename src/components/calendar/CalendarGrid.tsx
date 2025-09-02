// src/components/calendar/CalendarGrid.tsx
"use client";

import { DateTime, Interval } from "luxon";
import { useMemo, useState, useCallback } from "react";
import { useEvents, type EventItem } from "@/app/hooks/useEvents";
import { TZ, dt } from "@/lib/tz";

const START_HOUR = 10;
const END_HOUR = 18;          // 10–18
const HOUR_HEIGHT = 64;       // px per hour

type Props = {
    /** Клик по пустому дню -> открыть форму создания. YYYY-MM-DD в TZ */
    onSelectSlot?: (isoDate: string) => void;
    /** Клик по карточке события -> открыть форму редактирования */
    onEditEvent?: (ev: EventItem) => void;
};

export default function CalendarGrid({ onSelectSlot, onEditEvent }: Props) {
    // начало недели (вс)
    const [weekStart, setWeekStart] = useState<DateTime>(() =>
        dt().startOf("week")
    );

    // фетчим события на всю неделю
    const fromISO = weekStart.startOf("day").toISO();
    const toISO = weekStart.plus({ days: 7 }).endOf("day").toISO();
    const { list } = useEvents({ fromISO, toISO });
    const events = list.data ?? [];

    const days: DateTime[] = useMemo(
        () => Array.from({ length: 7 }, (_, i) => weekStart.plus({ days: i })),
        [weekStart]
    );

    const grouped = useMemo(() => groupByDay(events, days[0]!), [events, days]);

    const selectDate = useCallback(
        (d: DateTime | string) => {
            const iso = typeof d === "string" ? d : d.setZone(TZ).toISODate()!;
            onSelectSlot?.(iso);
        },
        [onSelectSlot]
    );

    const goPrev = () => setWeekStart((d: DateTime) => d.minus({ days: 7 }));
    const goNext = () => setWeekStart((d: DateTime) => d.plus({ days: 7 }));
    const goToday = () => setWeekStart(dt().startOf("week"));

    return (
        <div className="rounded-2xl border bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm text-gray-500">
                    {days[0]!.toFormat("LLL d")} – {days[6]!.toFormat("LLL d, yyyy")} · Loaded: {events.length}
                </div>
                <div className="flex gap-2">
                    <button
                        className="rounded-lg border px-3 py-1 text-sm"
                        onClick={() => selectDate(dt())}
                    >
                        + New Event
                    </button>
                    <button className="rounded-lg border px-3 py-1 text-sm" onClick={goPrev}>← Prev</button>
                    <button className="rounded-lg border px-3 py-1 text-sm" onClick={goToday}>Today</button>
                    <button className="rounded-lg border px-3 py-1 text-sm" onClick={goNext}>Next →</button>
                </div>
            </div>

            {/* Header */}
            <div className="grid grid-cols-8 gap-0 border-b px-4 py-2 text-sm">
                <div className="text-gray-400" />
                {days.map((d) => (
                    <div key={d.toISODate()} className="text-center font-medium">
                        {d.toFormat("ccc LLL d")}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-8 gap-0 px-4 pb-4">
                {/* левый столбец (часы) */}
                <div className="relative">
                    <div style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>
                        {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i).map((h) => (
                            <div
                                key={h}
                                className="absolute left-0 -translate-y-2 text-xs text-gray-400"
                                style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
                            >
                                {DateTime.fromObject({ hour: h }, { zone: TZ }).toFormat("h a")}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7 колонок дней */}
                {days.map((day) => (
                    <DayColumn
                        key={day.toISODate()}
                        day={day}
                        events={grouped[day.toISODate()!] ?? []}
                        onSelect={() => selectDate(day)}
                        onEventClick={onEditEvent}
                    />
                ))}
            </div>
        </div>
    );
}

/* -------- helpers -------- */

function DayColumn({
    day,
    events,
    onSelect,
    onEventClick,
}: {
    day: DateTime;
    events: EventItem[];
    onSelect: () => void;
    onEventClick?: (ev: EventItem) => void;
}) {
    const colHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

    return (
        <div className="relative border-l">
            {/* клик по фону дня — создание */}
            <div className="rounded-xl border bg-gray-50" style={{ height: colHeight }} onClick={onSelect} />
            {/* деления по часам */}
            {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i).map((i) => (
                <div
                    key={i}
                    className="pointer-events-none absolute left-0 right-0 border-t border-gray-200"
                    style={{ top: (i + 1) * HOUR_HEIGHT }}
                />
            ))}
            {/* карточки событий */}
            {events.map((ev) => {
                const pos = toPosition(ev, day);
                if (!pos) return null;
                return (
                    <div
                        key={ev.id}
                        className="absolute left-1 right-1 cursor-pointer rounded-xl border bg-white p-2 shadow-sm"
                        style={{ top: pos.top, height: pos.height }}
                        onClick={(e) => { e.stopPropagation(); onEventClick?.(ev); }}
                        title={`${ev.title} • ${fmt(ev.start)}–${fmt(ev.end)}`}
                    >
                        <div className="text-[13px] font-semibold leading-4">{ev.title}</div>
                        <div className="text-[12px] text-gray-500">
                            {fmt(ev.start)}–{fmt(ev.end)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function groupByDay(events: EventItem[], weekStart: DateTime) {
    const map: Record<string, EventItem[]> = {};
    const start = weekStart.startOf("day");
    const end = weekStart.plus({ days: 7 }).endOf("day");

    for (const ev of events) {
        const s = dt(ev.start);
        const e = dt(ev.end);
        if (e <= start || s >= end) continue;
        const key = s.toISODate()!;
        (map[key] ||= []).push(ev);
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.start.localeCompare(b.start));
    return map;
}

function toPosition(ev: EventItem, day: DateTime) {
    const dayStart = day.set({ hour: START_HOUR, minute: 0, second: 0, millisecond: 0 });
    const dayEnd = day.set({ hour: END_HOUR, minute: 0, second: 0, millisecond: 0 });
    const s = dt(ev.start);
    const e = dt(ev.end);
    const clamped = Interval.fromDateTimes(s, e).intersection(Interval.fromDateTimes(dayStart, dayEnd));
    if (!clamped) return null;
    const minsFromStart = clamped.start.diff(dayStart, "minutes").minutes;
    const durMins = clamped.end.diff(clamped.start, "minutes").minutes;
    return {
        top: (minsFromStart / 60) * HOUR_HEIGHT,
        height: Math.max(24, (durMins / 60) * HOUR_HEIGHT - 6),
    };
}

function fmt(iso: string) {
    return dt(iso).toFormat("t");
}
