// src/app/api/calendar/update/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuth, getCalendar } from "@/lib/gcal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UpdateSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1).optional(),
    start: z.string().datetime({ offset: true }).optional(), // ←
    end: z.string().datetime({ offset: true }).optional(), // ←
    notes: z.string().optional(),
});

// те же clash/hasDayClash, но игнорим событие само по id
import { dt } from "@/lib/tz";
const clash = (aS: string, aE: string, bS: string, bE: string) =>
    dt(aS) < dt(bE) && dt(bS) < dt(aE);
async function hasDayClash(calendar: any, calendarId: string, startISO: string, endISO: string, ignoreId: string) {
    const dayStart = dt(startISO).startOf("day").toISO();
    const dayEnd = dt(startISO).endOf("day").toISO();
    const { data } = await calendar.events.list({
        calendarId,
        timeMin: dayStart,
        timeMax: dayEnd,
        singleEvents: true,
        orderBy: "startTime",
    });
    return (data.items ?? []).some((ev: any) => {
        if (ev.status === "cancelled") return false;
        if (ev.id === ignoreId) return false;
        const s = ev.start?.dateTime ?? (ev.start?.date ? `${ev.start.date}T00:00:00` : "");
        const e = ev.end?.dateTime ?? (ev.end?.date ? `${ev.end.date}T23:59:59` : "");
        return s && e && clash(startISO, endISO, s, e);
    });
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const parsed = UpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ ok: false, error: parsed.error.message }, { status: 400 });
        }
        const { id, title, start, end, notes } = parsed.data;

        const auth = getAuth(["https://www.googleapis.com/auth/calendar"]);
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        if (start && end) {
            if (await hasDayClash(calendar, calendarId, start, end, id)) {
                return NextResponse.json({ ok: false, error: "Time slot conflict" }, { status: 409 });
            }
        }

        const { data } = await calendar.events.patch({
            calendarId,
            eventId: id,
            requestBody: {
                ...(title ? { summary: title } : {}),
                ...(notes ? { description: notes } : {}),
                ...(start ? { start: { dateTime: start } } : {}),
                ...(end ? { end: { dateTime: end } } : {}),
            },
            sendUpdates: "none",
        });

        return NextResponse.json({
            ok: true,
            id,
            title: data.summary ?? title,
            start: start ?? data.start?.dateTime ?? "",
            end: end ?? data.end?.dateTime ?? "",
        });
    } catch (err: any) {
        console.error("[api/calendar/update]", err);
        return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
    }
}
