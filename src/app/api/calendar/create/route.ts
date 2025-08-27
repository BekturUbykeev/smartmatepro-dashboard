import { NextResponse } from "next/server";
import { calendarService } from "@/lib/calendarService";

// fallback для старых клиентов
function toISO(date: string, time: string) {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).toISOString(); // серверная TZ — только как запасной путь
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, start, end, date, time, durationMins } = body || {};
        if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

        let s = start as string | undefined;
        let e = end as string | undefined;

        if (!s || !e) {
            if (!date || !time) return NextResponse.json({ error: "Missing date/time" }, { status: 400 });
            const iso = toISO(String(date), String(time));
            const dur = Number(durationMins || 60);
            s = iso;
            e = new Date(new Date(iso).getTime() + dur * 60000).toISOString();
        }

        const created = await calendarService.create(String(title), s, e);
        return NextResponse.json({ ok: true, created }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
