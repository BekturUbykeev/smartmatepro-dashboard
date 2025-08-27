// src/lib/calendarService.ts
export type CalEvent = { id: string; title: string; start: string; end: string };
export type WeekPayload = { events: CalEvent[]; start: string; end: string; mode: "memory" | "google" };

const mode = (process.env.CAL_MODE ?? "memory") as "memory" | "google";

/* ---------- helpers ---------- */
const startOfWeek = (d: Date) => {
    const x = new Date(d);
    const day = x.getDay(); // 0 - Sun
    x.setDate(x.getDate() - day);
    x.setHours(0, 0, 0, 0);
    return x;
};
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

/* ---------- in-memory impl ---------- */
let mem: CalEvent[] = [
    // пример данных; можно удалить
    // { id: "ex1", title: "uu", start: "2025-08-25T10:30:00.000Z", end: "2025-08-25T11:30:00.000Z" },
    // { id: "ex2", title: "jj", start: "2025-08-27T13:00:00.000Z", end: "2025-08-27T14:00:00.000Z" },
];

const memService = {
    week: async (offset = 0): Promise<WeekPayload> => {
        const now = new Date();
        const start = startOfWeek(addDays(now, offset * 7));
        const end = addDays(start, 7);
        const events = mem.filter(e => {
            const s = new Date(e.start).getTime();
            return s >= start.getTime() && s < end.getTime();
        });
        return { events, start: start.toISOString(), end: end.toISOString(), mode: "memory" };
    },
    create: async (title: string, startISO: string, endISO: string) => {
        const ev = { id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, title, start: startISO, end: endISO };
        mem.push(ev);
        return ev;
    },
    update: async (id: string, patch: Partial<Omit<CalEvent, "id">>) => {
        const i = mem.findIndex(e => e.id === id);
        if (i === -1) throw new Error("Not found");
        mem[i] = { ...mem[i], ...patch };
        return mem[i];
    },
    delete: async (id: string) => {
        mem = mem.filter(e => e.id !== id);
        return { ok: true };
    },
};

/* ---------- facade ---------- */
export const calendarService = {
    week: (offset?: number) => memService.week(offset),           // TODO: подключить google здесь
    create: (title: string, startISO: string, endISO: string) => memService.create(title, startISO, endISO),
    update: (id: string, patch: Partial<Omit<CalEvent, "id">>) => memService.update(id, patch),
    delete: (id: string) => memService.delete(id),
    mode,
};
