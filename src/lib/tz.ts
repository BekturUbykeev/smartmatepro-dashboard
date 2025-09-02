// src/lib/tz.ts
import { DateTime } from "luxon";

export const TZ = process.env.NEXT_PUBLIC_TZ || "America/Los_Angeles";

export const dt = (iso?: string) =>
    iso
        ? DateTime.fromISO(iso, { zone: TZ })
        : DateTime.now().setZone(TZ);

// Утилиты для дня
export const dayRange = (isoDate: string) => {
    const d = DateTime.fromISO(isoDate, { zone: TZ });
    return {
        fromISO: d.startOf("day").toISO(),
        toISO: d.endOf("day").toISO(),
    };
};
