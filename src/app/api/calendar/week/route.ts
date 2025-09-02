// src/app/api/calendar/week/route.ts
import { NextResponse } from "next/server";
import { getAuth, getCalendar } from "@/lib/gcal";
import { TZ, dt } from "@/lib/tz";

export const runtime = "nodejs";          // не edge
export const dynamic = "force-dynamic";   // без кэша

type EventDTO = {
    id: string;
    title: string;
    start: string; // ISO
    end: string;   // ISO
};

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const offset = Number(searchParams.get("offset") ?? 0);
        const mode = (searchParams.get("mode") ?? process.env.CALENDAR_MODE ?? "live") as
            | "live"
            | "memory";

        // Неделя с ВОСКРЕСЕНЬЯ 00:00 по локальной TZ
        // ISO: Monday=1 ... Sunday=7 → берём Sunday (7)
        const base = dt().plus({ weeks: offset });     // сегодня + offset недель
        const monday = base.startOf("week");           // ISO-неделя: понедельник 00:00
        const weekStart = monday.minus({ days: 1 });   // воскресенье 00:00 — старт нашей недели
        const weekEnd = weekStart.plus({ days: 7 });   // эксклюзивная верхняя граница

        if (mode === "memory") {
            return NextResponse.json({
                events: [],
                start: weekStart.toISO(),
                end: weekEnd.toISO(),
                mode: "memory",
            });
        }

        // LIVE: читаем из Google Calendar
        const auth = getAuth(["https://www.googleapis.com/auth/calendar.readonly"]);
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        const { data } = await calendar.events.list({
            calendarId,
            timeMin: weekStart.toISO(), // RFC3339 с учётом TZ
            timeMax: weekEnd.toISO(),   // Google трактует как эксклюзивную границу
            singleEvents: true,
            orderBy: "startTime",
        });
        console.log("[/api/calendar/week]", {
            calendarId,
            start: weekStart.toISO(),
            end: weekEnd.toISO(),
            items: (data.items ?? []).length,
            sample: (data.items ?? []).slice(0, 3).map(e => ({
                id: e.id,
                start: e.start?.dateTime ?? e.start?.date,
                end: e.end?.dateTime ?? e.end?.date,
                status: e.status,
            })),
        });


        const events: EventDTO[] = (data.items ?? [])
            .filter(e => e.status !== "cancelled")
            .map((e) => {
                const start = e.start?.dateTime ?? (e.start?.date ? `${e.start.date}T00:00:00` : "");
                const end = e.end?.dateTime ?? (e.end?.date ? `${e.end.date}T23:59:59` : "");
                return { id: e.id!, title: e.summary ?? "Booking", start, end };
            });

        return NextResponse.json({
            events,
            start: weekStart.toISO(),
            end: weekEnd.toISO(),
            mode: "live",
        });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
