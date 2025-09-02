"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { TZ, dt } from "@/lib/tz";

export type EventItem = {
    id: string;
    clientId?: string | null;   // ← добавили null для устойчивости
    title: string;
    start: string; // ISO
    end: string;   // ISO
    notes?: string;
};

export type CreatePayload = {
    title: string;
    start: string;   // ISO
    end: string;     // ISO
    clientId: string;
};

// какие поля можно обновлять
export type UpdatePayload = {
    id: string;
    title?: string;
    start?: string;  // ISO
    end?: string;    // ISO
};

type Range = { fromISO?: string; toISO?: string };


/**
 * Чтение: тянем 1–2 недели из /api/calendar/week по offset и фильтруем по диапазону.
 * Создание/обновление/удаление: /api/calendar/{create,update,delete}
 */
async function fetchEvents(params?: Range): Promise<EventItem[]> {
    const now = dt();
    const from = params?.fromISO ? dt(params.fromISO) : now.startOf("week").minus({ days: 1 }).startOf("day");
    const to = params?.toISO ? dt(params.toISO) : from.plus({ days: 7 });

    const startOfWeek = (d: DateTime) => d.startOf("week").minus({ days: 1 }).startOf("day"); // воскресенье 00:00
    const baseWeek = startOfWeek(now);
    const fromWeek = startOfWeek(from);
    const toWeek = startOfWeek(to);

    const weeks: number[] = [];
    const diffFrom = Math.floor(fromWeek.diff(baseWeek, "weeks").weeks);
    const diffTo = Math.floor(toWeek.diff(baseWeek, "weeks").weeks);
    for (let off = diffFrom; off <= diffTo; off++) weeks.push(off);

    const all: EventItem[] = [];
    for (const off of weeks) {
        const res = await fetch(`/api/calendar/week?offset=${off}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load events");
        const j = await res.json();
        all.push(...((j.events ?? []) as EventItem[]));
    }

    const fromMs = from.toMillis();
    const toMs = to.toMillis();
    return all.filter(e => {
        const s = dt(e.start).toMillis();
        const en = dt(e.end).toMillis();
        return en > fromMs && s < toMs;
    });
}

// ...
export function useEvents(params?: Range) {
    const qc = useQueryClient();

    const list = useQuery({
        queryKey: ["events", params?.fromISO, params?.toISO],
        queryFn: () => fetchEvents(params),
        staleTime: 15_000,
    });

    const create = useMutation({
        mutationFn: async (payload: { title: string; start: string; end: string; client?: any; clientId?: string; notes?: string }) => {
            const res = await fetch(`/api/calendar/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // важный момент: шлём и clientId, и client — на случай, если бек ждёт одно из двух
                body: JSON.stringify({
                    title: payload.title,
                    start: payload.start,
                    end: payload.end,
                    clientId: payload.clientId ?? null,
                    client: payload.client ?? null,
                    notes: payload.notes ?? null,
                }),
            });
            const j = await res.json();
            if (!res.ok || j?.ok === false) throw new Error(j?.error || "Failed to create");
            return j;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["events"], exact: false });
            qc.invalidateQueries({ queryKey: ["metrics"], exact: false });
        },
    });

    const update = useMutation({
        mutationFn: async (payload: { id: string; title: string; start: string; end: string }) => {
            const res = await fetch(`/api/calendar/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const j = await res.json();
            if (!res.ok || j?.ok === false) throw new Error(j?.error || "Failed to update");
            return j;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["events"], exact: false });
            qc.invalidateQueries({ queryKey: ["metrics"], exact: false });
        },
    });

    const remove = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/calendar/delete?id=${encodeURIComponent(id)}`, { method: "DELETE" });
            const j = await res.json();
            if (!res.ok || j?.ok === false) throw new Error(j?.error || "Failed to delete");
            return true;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["events"], exact: false });
            qc.invalidateQueries({ queryKey: ["metrics"], exact: false });
        },
    });

    return { list, create, update, remove };
}
