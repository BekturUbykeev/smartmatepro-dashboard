"use client";

import { DateTime } from "luxon";
import { useEvents } from "@/app/hooks/useEvents";
import { useState } from "react";
import { TZ, dt } from "@/lib/tz";


export default function UpcomingList() {
    // freeze range at mount
    const [range] = useState(() => {
        const now = dt();
        return {
            fromISO: now.startOf("day").toISO(),
            toISO: now.plus({ days: 7 }).endOf("day").toISO(),
        };
    });

    const { list } = useEvents(range);

    const items = (list.data ?? [])
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 10);

    return (
        <div className="rounded-2xl border p-4">
            <div className="mb-2 text-sm font-semibold">Upcoming (7 days)</div>
            <ul className="space-y-2">
                {items.map((ev) => (
                    <li key={ev.id} className="flex items-center justify-between">
                        <div className="text-sm">
                            <div className="font-medium">{ev.title}</div>
                            <div className="text-xs text-gray-500">
                                {dt(ev.start).toFormat("EEE, MMM d • HH:mm")}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">#{ev.clientId ?? ""}</div>
                    </li>
                ))}
                {items.length === 0 && (
                    <li className="text-sm text-gray-500">No upcoming appointments</li>
                )}
            </ul>
        </div>
    );
}
