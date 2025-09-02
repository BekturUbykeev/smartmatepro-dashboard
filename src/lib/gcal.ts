// src/lib/gcal.ts
import { google } from "googleapis";

export function getAuth(scope: string | string[]) {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_B64) {
        throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_B64 in env");
    }

    // Декодим JSON из base64
    const json = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, "base64").toString("utf-8");
    const creds = JSON.parse(json);

    const email = creds.client_email;
    const key = creds.private_key?.replace(/\\n/g, "\n");

    if (!email || !key) {
        throw new Error("Missing client_email or private_key in GOOGLE_SERVICE_ACCOUNT_B64");
    }

    const scopes = Array.isArray(scope) ? scope : [scope];
    return new google.auth.JWT({ email, key, scopes });
}

export function getCalendar(auth: any) {
    return google.calendar({ version: "v3", auth });
}

// Извлекаем часы/минуты из ISO
function extractHM(iso: string) {
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (!m) return null;
    return { h: Number(m[1]), min: Number(m[2]) };
}

/** Валидируем слоты: 10:00–18:00, шаг ровно 2 часа */
export function validateSlot(startISO: string, endISO: string) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Invalid date";

    const durMin = Math.round((end.getTime() - start.getTime()) / 60000);
    if (durMin !== 120) return "Slot must be exactly 2 hours";

    const s = extractHM(startISO);
    const e = extractHM(endISO);
    if (!s || !e) return "Invalid ISO time";
    if (s.min !== 0) return "Start must be at :00";

    const allowedStarts = [10, 12, 14, 16];
    if (!allowedStarts.includes(s.h))
        return "Start must be 10:00, 12:00, 14:00 or 16:00";

    if (e.h > 18 || (e.h === 18 && e.min > 0)) return "End must be ≤ 18:00";

    return null;
}

export async function hasOverlap(opts: {
    calendarId: string;
    startISO: string;
    endISO: string;
    auth: any;
    excludeId?: string;
}) {
    const calendar = getCalendar(opts.auth);
    const { data } = await calendar.events.list({
        calendarId: opts.calendarId,
        timeMin: opts.startISO,
        timeMax: opts.endISO,
        singleEvents: true,
        orderBy: "startTime",
    });
    const items = (data.items ?? []).filter((e) =>
        opts.excludeId ? e.id !== opts.excludeId : true
    );
    return items.length > 0;
}
