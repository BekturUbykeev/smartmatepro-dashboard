// src/app/api/calendar/delete/route.ts
import { NextResponse } from "next/server";
import { getAuth, getCalendar } from "@/lib/gcal";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

        const auth = getAuth("https://www.googleapis.com/auth/calendar");
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        await calendar.events.delete({ calendarId, eventId: id });
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
    }
}
