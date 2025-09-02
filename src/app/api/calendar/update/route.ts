// src/app/api/calendar/update/route.ts
import { NextResponse } from "next/server";
import { getAuth, getCalendar, hasOverlap, validateSlot } from "@/lib/gcal";

export async function PATCH(req: Request) {
    try {
        const { id, title, start, end } = await req.json();
        if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

        const err = validateSlot(start, end);
        if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

        const auth = getAuth("https://www.googleapis.com/auth/calendar");
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        if (await hasOverlap({ calendarId, startISO: start, endISO: end, auth, excludeId: id })) {
            return NextResponse.json({ ok: false, error: "Slot overlaps" }, { status: 409 });
        }

        const { data } = await calendar.events.patch({
            calendarId,
            eventId: id,
            requestBody: {
                summary: title,
                start: { dateTime: start },
                end: { dateTime: end },
            },
        });

        return NextResponse.json({ ok: true, id: data.id });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
    }
}
