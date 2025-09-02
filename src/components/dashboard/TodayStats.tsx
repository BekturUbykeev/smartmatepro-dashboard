"use client";

import { DateTime } from "luxon";
import { useEvents } from "@/app/hooks/useEvents";
import { useAvailability } from "@/app/hooks/useAvailability";
import { TZ, dt } from "@/lib/tz";


export default function TodayStats() {
    const day = dt().toISODate()!;
    const fromISO = dt(day).startOf("day").toISO();
    const toISO = dt(day).endOf("day").toISO();

    const { list } = useEvents({ fromISO, toISO });
    const events = list.data ?? [];

    const freeSlots = useAvailability(day, events);
    const totalSlots = 4; // 10–12, 12–14, 14–16, 16–18
    const booked = events.length;
    const free = freeSlots.length;

    return (
        <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border p-4">
                <div className="text-xs text-gray-500">Today — Appointments</div>
                <div className="mt-1 text-2xl font-semibold">{booked}</div>
            </div>
            <div className="rounded-2xl border p-4">
                <div className="text-xs text-gray-500">Free slots</div>
                <div className="mt-1 text-2xl font-semibold">{free}/{totalSlots}</div>
            </div>
            <div className="rounded-2xl border p-4">
                <div className="text-xs text-gray-500">Utilization</div>
                <div className="mt-1 text-2xl font-semibold">
                    {Math.round(((booked) / totalSlots) * 100)}%
                </div>
            </div>
        </div>
    );
}
