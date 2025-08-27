// src/app/api/calendar/week/route.ts
import { NextResponse } from "next/server";
import { calendarService } from "@/lib/calendarService";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get("offset") ?? 0);
    const data = await calendarService.week(offset); // ⬅️ одна точка правды
    return NextResponse.json(data);
}
