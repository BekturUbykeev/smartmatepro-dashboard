// src/app/api/metrics/overview/route.ts
import { NextResponse } from "next/server";
import { getAuth, getCalendar } from "@/lib/gcal";
import { dt } from "@/lib/tz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Overview = {
    start: string;
    end: string;
    appointmentsNext7: number;
    appointmentsToday: number;
    bookedMinutesNext7: number;
    capacityMinutesNext7: number;
    utilizationNext7: number; // 0..1
    topHours: Array<{ hour: number; count: number }>;
};

// Грубое выравнивание all-day событий к 00:00..23:59
function toISODateTime(
    start?: { date?: string; dateTime?: string } | null,
    end?: { date?: string; dateTime?: string } | null
) {
    const s = start?.dateTime ?? (start?.date ? `${start.date}T00:00:00` : "");
    const e = end?.dateTime ?? (end?.date ? `${end.date}T23:59:59` : "");
    return { s, e };
}

// Мини-тип под ответ Google, чтобы TS не ругался на optional-поля
type GoogleEvent = {
    id?: string;
    summary?: string;
    status?: string;
    start?: { date?: string; dateTime?: string } | null;
    end?: { date?: string; dateTime?: string } | null;
};

export async function GET() {
    try {
        const now = dt();
        const from = now.startOf("day");
        const to = now.plus({ days: 7 }).endOf("day");

        const auth = getAuth(["https://www.googleapis.com/auth/calendar.readonly"]);
        const calendar = getCalendar(auth);
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        const { data } = await calendar.events.list({
            calendarId,
            timeMin: from.toISO(),
            timeMax: to.toISO(),
            singleEvents: true,
            orderBy: "startTime",
        });

        // 1) Отбрасываем отменённые; 2) Нормализуем даты; 3) Убираем события без корректных дат
        const items = (data.items ?? []) as GoogleEvent[];
        const raw = items.filter((ev) => ev.status !== "cancelled");

        const events = raw.flatMap((ev) => {
            const { s, e } = toISODateTime(ev.start ?? undefined, ev.end ?? undefined);
            if (!s || !e) return []; // защитимся от пустых дат
            return [{ id: ev.id ?? "", title: ev.summary ?? "Booking", start: s, end: e }];
        });

        // --- Метрики ---
        const appointmentsNext7 = events.length;
        const appointmentsToday = events.filter((ev) => dt(ev.start).hasSame(now, "day")).length;

        const bookedMinutesNext7 = events.reduce((acc, ev) => {
            const ms = dt(ev.end).toMillis() - dt(ev.start).toMillis();
            return acc + Math.max(0, Math.round(ms / 60000));
        }, 0);

        // Рабочие часы/дни: можно переопределить через .env.local
        const startHH = process.env.BUSINESS_HOURS_START ?? "09:00";
        const endHH = process.env.BUSINESS_HOURS_END ?? "17:00";
        // По умолчанию считаем только Пн–Пт: 1=Mon … 7=Sun
        const workingDays = (process.env.BUSINESS_WORKDAYS ?? "1,2,3,4,5")
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => n >= 1 && n <= 7);

        const [sH, sM] = startHH.split(":").map(Number);
        const [eH, eM] = endHH.split(":").map(Number);
        const perDayMinutes = Math.max(0, (eH * 60 + eM) - (sH * 60 + sM));

        // Capacity за ближайшие 7 дней только по рабочим дням
        let capacityMinutesNext7 = 0;
        for (let i = 0; i < 7; i++) {
            const day = from.plus({ days: i });
            if (workingDays.includes(day.weekday)) {
                capacityMinutesNext7 += perDayMinutes;
            }
        }

        const utilizationNext7 =
            capacityMinutesNext7 > 0 ? bookedMinutesNext7 / capacityMinutesNext7 : 0;

        // Топ-часы по часу начала
        const hourMap = new Map<number, number>();
        for (const ev of events) {
            const h = dt(ev.start).hour; // 0..23
            hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
        }
        const topHours = Array.from(hourMap.entries())
            .map(([hour, count]) => ({ hour, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        const payload: Overview = {
            start: from.toISO()!,
            end: to.toISO()!,
            appointmentsNext7,
            appointmentsToday,
            bookedMinutesNext7,
            capacityMinutesNext7,
            utilizationNext7,
            topHours,
        };

        return NextResponse.json(payload);
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
