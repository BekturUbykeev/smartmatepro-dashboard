// src/app/api/calendar/create/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuth, getCalendar } from "@/lib/gcal";
import { dt } from "@/lib/tz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateSchema = z.object({
    title: z.string().min(1),
    start: z.string().datetime({ offset: true }), // ← было .datetime()
    end: z.string().datetime({ offset: true }), // ←
    clientId: z.string().min(1),
    notes: z.string().optional(),
});

// интервал A пересекает B?
const clash = (aS: string, aE: string, bS: string, bE: string) =>
    dt(aS) < dt(bE) && dt(bS) < dt(aE);

async function hasDayClash(calendar: any, calendarId: string, startISO: string, endISO: string) {
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
        const s = ev.start?.dateTime ?? (ev.start?.date ? `${ev.start.date}T00:00:00` : "");
        const e = ev.end?.dateTime ?? (ev.end?.date ? `${ev.end.date}T23:59:59` : "");
        return s && e && clash(startISO, endISO, s, e);
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = CreateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ ok: false, error: parsed.error.message }, { status: 400 });
        }
        const { title, start, end, notes } = parsed.data;

        const auth = getAuth(["https://www.googleapis.com/auth/calendar"]);
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        // конфликт?
        if (await hasDayClash(calendar, calendarId, start, end)) {
            return NextResponse.json({ ok: false, error: "Time slot conflict" }, { status: 409 });
        }

        const { data } = await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: title,
                description: notes ?? undefined,
                start: { dateTime: start },
                end: { dateTime: end },
            },
            sendUpdates: "none",
        });

        return NextResponse.json({
            ok: true,
            id: data.id,
            title: data.summary ?? title,
            start,
            end,
        });
    } catch (err: any) {
        console.error("[api/calendar/create]", err);
        return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
    }
}
