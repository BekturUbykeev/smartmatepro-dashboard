// src/app/api/calendar/create/route.ts
import { NextResponse } from "next/server";
import { getAuth, getCalendar, hasOverlap, validateSlot } from "@/lib/gcal";

export async function POST(req: Request) {
    try {
        const { title, start, end, client } = await req.json();

        const err = validateSlot(start, end);
        if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

        const auth = getAuth("https://www.googleapis.com/auth/calendar");
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        if (await hasOverlap({ calendarId, startISO: start, endISO: end, auth })) {
            return NextResponse.json({ ok: false, error: "Slot overlaps" }, { status: 409 });
        }

        const ev = await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: title || "Booking",
                start: { dateTime: start },
                end: { dateTime: end },
                extendedProperties: {
                    private: {
                        source: "smartmatepro",
                        clientName: client?.name ?? "",
                        clientPhone: client?.phone ?? "",
                    },
                },
            },
        });

        return NextResponse.json({ ok: true, id: ev.data.id });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
    }
}
