// src/app/hooks/useEvents.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { dt } from "@/lib/tz";
import { toast } from "sonner";

export type EventItem = {
    id: string;
    clientId?: string | null;
    title: string;
    start: string; // ISO
    end: string;   // ISO
    notes?: string;
};

export type CreatePayload = {
    title: string;
    start: string; // ISO
    end: string;   // ISO
    clientId: string;
    notes?: string;
};

export type UpdatePayload = {
    id: string;
    title?: string;
    start?: string; // ISO
    end?: string;   // ISO
    notes?: string;
};

type Range = { fromISO?: string; toISO?: string };

/** Чтение: тянем 1–2 недели из /api/calendar/week по offset и фильтруем по диапазону. */
async function fetchEvents(params?: Range): Promise<EventItem[]> {
    const now = dt();
    const from = params?.fromISO ? dt(params.fromISO) : now.startOf("week").minus({ days: 1 }).startOf("day"); // Sun 00:00
    const to = params?.toISO ? dt(params.toISO) : from.plus({ days: 7 });

    const startOfWeek = (d: DateTime) => d.startOf("week").minus({ days: 1 }).startOf("day"); // Sun 00:00
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
    return all.filter((e) => {
        const s = dt(e.start).toMillis();
        const en = dt(e.end).toMillis();
        return en > fromMs && s < toMs;
    });
}

export function useEvents(params?: Range) {
    const qc = useQueryClient();

    const list = useQuery({
        queryKey: ["events", params?.fromISO, params?.toISO],
        queryFn: () => fetchEvents(params),
        staleTime: 15_000,
        retry: 1,
    });

    // ---- helpers для ошибок HTTP
    const errorMsg = async (res: Response, fallback: string) => {
        let j: any = null;
        try { j = await res.json(); } catch { }
        if (j?.error) return j.error;
        if (res.status === 409) return "Time slot conflict";
        return `${fallback} (${res.status})`;
    };

    // CREATE
    const create = useMutation({
        mutationFn: async (payload: CreatePayload) => {
            const res = await fetch(`/api/calendar/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await errorMsg(res, "Failed to create"));
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["events"], exact: false });
            qc.invalidateQueries({ queryKey: ["metrics"], exact: false });
        },
        onError: (e: any) => toast.error(e?.message ?? "Error"),
    });

    // UPDATE
    const update = useMutation({
        mutationFn: async (payload: UpdatePayload) => {
            const res = await fetch(`/api/calendar/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await errorMsg(res, "Failed to update"));
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["events"], exact: false });
            qc.invalidateQueries({ queryKey: ["metrics"], exact: false });
        },
        onError: (e: any) => toast.error(e?.message ?? "Error"),
    });

    // DELETE
    const remove = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/calendar/delete?id=${encodeURIComponent(id)}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await errorMsg(res, "Failed to delete"));
            return true;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["events"], exact: false });
            qc.invalidateQueries({ queryKey: ["metrics"], exact: false });
        },
        onError: (e: any) => toast.error(e?.message ?? "Error"),
    });

    return { list, create, update, remove };
}
