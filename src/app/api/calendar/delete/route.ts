// src/app/api/calendar/delete/route.ts
import { NextResponse } from "next/server";
import { calendarService } from "@/lib/calendarService";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
        await calendarService.delete(id);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
