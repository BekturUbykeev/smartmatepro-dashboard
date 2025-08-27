// src/app/api/calendar/update/route.ts
import { NextResponse } from "next/server";
import { calendarService } from "@/lib/calendarService";

function toISO(date: string, time: string) {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, title, start, end, date, time, durationMins } = body || {};
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const patch: { title?: string; start?: string; end?: string } = {};
        if (typeof title === "string") patch.title = title;

        // Вариант 1: пришли готовые ISO start/end
        if (typeof start === "string" && typeof end === "string") {
            patch.start = start;
            patch.end = end;
        }
        // Вариант 2: пришли date/time (и, опционально, durationMins)
        else if (typeof date === "string" && typeof time === "string") {
            const s = toISO(date, time);
            const dur = Number(durationMins || 60);
            const e = new Date(new Date(s).getTime() + dur * 60000).toISOString();
            patch.start = s;
            patch.end = e;
        }

        const updated = await calendarService.update(id, patch);
        return NextResponse.json({ ok: true, updated });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
