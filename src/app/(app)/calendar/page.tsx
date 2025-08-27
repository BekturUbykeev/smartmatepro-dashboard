// src/app/(app)/calendar/page.tsx
'use client';

import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

type CalEvent = { id: string; title: string; start: string; end: string };
type WeekPayload = { events: CalEvent[]; start: string; end: string; mode?: string };

const HOUR_PX = 64;
const START_HOUR = 10;
const END_HOUR = 19;

function fmtWeekHeader(startISO: string, endISO: string) {
    const s = new Date(startISO);
    const ePrev = new Date(new Date(endISO).getTime() - 86400000);
    const left = `${s.toLocaleDateString(undefined, { month: 'short' })} ${s.getDate()}`;
    const right = `${ePrev.toLocaleDateString(undefined, { month: 'short' })} ${ePrev.getDate()}`;
    const yr = s.getFullYear() === ePrev.getFullYear() ? s.getFullYear() : `${s.getFullYear()} / ${ePrev.getFullYear()}`;
    return `${left} – ${right}, ${yr}`;
}
const mins = (d: Date) => d.getHours() * 60 + d.getMinutes();
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export default function CalendarPage() {
    const [offset, setOffset] = React.useState(0);
    const [data, setData] = React.useState<WeekPayload | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<CalEvent | null>(null);

    const { success, error: toastError } = useToast();

    const fetchWeek = React.useCallback(async (off: number) => {
        setLoading(true);
        setError(null);
        try {
            const r = await fetch(`/api/calendar/week?offset=${off}`, { cache: 'no-store' });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const j = (await r.json()) as WeekPayload;
            setData(j);
        } catch (e: any) {
            setError(e?.message ?? 'Failed to load');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { fetchWeek(offset); }, [offset, fetchWeek]);

    const days = React.useMemo(() => {
        if (!data) return [];
        const start = new Date(data.start);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }, [data]);

    return (
        <div className="mx-auto w-full max-w-screen-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Calendar</h2>
                    <p className="text-sm text-gray-500">
                        {data ? fmtWeekHeader(data.start, data.end) : '—'}
                        {data && <> • Loaded: {data.events.length} • Mode: {data.mode ?? '—'} • Offset: {offset}</>}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(null); setOpen(true); }} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">+ New Event</button>
                    <button onClick={() => setOffset(o => o - 1)} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">← Prev</button>
                    <button onClick={() => setOffset(0)} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Today</button>
                    <button onClick={() => setOffset(o => o + 1)} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Next →</button>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            {/* Empty state */}
            {data && data.events.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-gray-500">
                    No events this week. Click “+ New Event”.
                </div>
            )}

            {/* Grid */}
            <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
                {/* Days header */}
                <div className="grid grid-cols-[72px_repeat(7,minmax(130px,1fr))] border-b bg-white/70 px-3 py-3">
                    <div />
                    {days.map((d, i) => (
                        <div key={i} className="px-2 text-sm font-medium">
                            {d.toLocaleDateString(undefined, { weekday: 'short' })}{' '}
                            {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="grid grid-cols-[72px_repeat(7,minmax(130px,1fr))]">
                    {/* time gutter */}
                    <div className="relative">
                        {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, idx) => {
                            const hour = START_HOUR + idx;
                            return (
                                <div key={hour} className="h-[64px] border-b border-gray-100 pr-2 text-right text-xs text-gray-500">
                                    <div className="translate-y-[-0.5rem]">
                                        {new Date(0, 0, 0, hour).toLocaleTimeString(undefined, { hour: 'numeric' })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* day columns */}
                    {days.map((day, di) => {
                        const events = (data?.events ?? []).filter(ev => {
                            const s = new Date(ev.start);
                            return s.getFullYear() === day.getFullYear() && s.getMonth() === day.getMonth() && s.getDate() === day.getDate();
                        });

                        type P = CalEvent & { col: number; cols: number };
                        const positioned: P[] = [];
                        events
                            .slice()
                            .sort((a, b) => +new Date(a.start) - +new Date(b.start))
                            .forEach(ev => {
                                let col = 0;
                                while (positioned.some(p => {
                                    const aS = +new Date(ev.start), aE = +new Date(ev.end);
                                    const bS = +new Date(p.start), bE = +new Date(p.end);
                                    return aS < bE && aE > bS && p.col === col;
                                })) col++;
                                positioned.push({ ...ev, col, cols: 1 });
                            });
                        const maxCol = Math.max(0, ...positioned.map(p => p.col));
                        positioned.forEach(p => p.cols = maxCol + 1);

                        return (
                            <div key={di} className="relative border-l border-gray-100" style={{ height: (END_HOUR - START_HOUR + 1) * HOUR_PX }}>
                                {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, idx) => (
                                    <div key={idx} className="absolute left-0 right-0 border-b border-gray-100" style={{ top: idx * HOUR_PX, height: 1 }} />
                                ))}

                                {positioned.map(ev => {
                                    const s = new Date(ev.start), e = new Date(ev.end);
                                    const startMin = mins(s), endMin = mins(e);
                                    const topMin = clamp(startMin - START_HOUR * 60, 0, (END_HOUR - START_HOUR + 1) * 60);
                                    const dur = Math.max(15, endMin - startMin);
                                    const top = (topMin / 60) * HOUR_PX;
                                    const height = (dur / 60) * HOUR_PX;
                                    const widthPct = 100 / ev.cols, leftPct = ev.col * widthPct;
                                    const t = `${s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}–${e.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;

                                    return (
                                        <div
                                            key={ev.id}
                                            className="group absolute rounded-xl bg-gray-50 p-2 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
                                            style={{ top, height, left: `${leftPct}%`, width: `calc(${widthPct}% - 8px)`, margin: '0 4px' }}
                                            title={t}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="text-sm font-semibold leading-4 line-clamp-2">{ev.title}</div>
                                                    <div className="mt-1 text-xs text-gray-600">{t}</div>
                                                </div>
                                                <div className="opacity-0 transition group-hover:opacity-100">
                                                    <button
                                                        className="rounded-md p-1 hover:bg-white"
                                                        onClick={() => { setEditing(ev); setOpen(true); }}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        className="ml-1 rounded-md p-1 hover:bg-white"
                                                        onClick={async () => {
                                                            if (!confirm('Delete this event?')) return;
                                                            try {
                                                                const res = await fetch('/api/calendar/delete', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ id: ev.id }),
                                                                });
                                                                if (!res.ok) throw new Error('Delete failed');
                                                                setData(prev => prev ? { ...prev, events: prev.events.filter(x => x.id !== ev.id) } : prev);
                                                                success('Event deleted');
                                                                fetchWeek(offset);
                                                            } catch (e: any) {
                                                                toastError(e?.message ?? 'Delete failed');
                                                            }
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {loading && <div className="mt-4 text-sm text-gray-500">Loading…</div>}

            {/* Modal: Create/Edit */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-md rounded-2xl border bg-white p-4 shadow-xl">
                        <div className="text-lg font-semibold">{editing ? 'Edit event' : 'Create event'}</div>

                        <form
                            className="mt-4 space-y-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const fd = new FormData(e.currentTarget as HTMLFormElement);

                                // Достаём поля формы
                                const title = String(fd.get('title') || '');
                                const date = String(fd.get('date') || '');
                                const time = String(fd.get('time') || '');
                                const durationMins = Number(fd.get('durationMins') || 60);

                                // СЧИТАЕМ ISO НА КЛИЕНТЕ (в твоём локальном поясе)
                                const [y, m, d] = date.split('-').map(Number);
                                const [hh, mm] = time.split(':').map(Number);
                                const startDate = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0);
                                const startISO = startDate.toISOString();
                                const endISO = new Date(startDate.getTime() + durationMins * 60000).toISOString();

                                try {
                                    if (editing) {
                                        // Полное редактирование: передаём готовые start/end + новый title
                                        const res = await fetch('/api/calendar/update', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ id: editing.id, title, start: startISO, end: endISO }),
                                        });
                                        if (!res.ok) throw new Error('Update failed');
                                    } else {
                                        // Создание: тоже слать готовые start/end
                                        const res = await fetch('/api/calendar/create', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ title, start: startISO, end: endISO }),
                                        });
                                        if (!res.ok) throw new Error('Create failed');
                                        const { created } = await res.json();
                                        setData(prev => prev ? { ...prev, events: [...prev.events, created] } : prev);
                                    }

                                    setOpen(false);
                                    setEditing(null);
                                    fetchWeek(offset);
                                } catch (err: any) {
                                    toastError(err?.message ?? 'Request failed');
                                }
                            }}
                        >
                            <input
                                name="title"
                                defaultValue={editing?.title ?? ''}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                                placeholder="Title"
                                required
                            />

                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    name="date"
                                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                                    defaultValue={editing ? new Date(editing.start).toISOString().slice(0, 10) : ''}
                                    required
                                />
                                <input
                                    type="time"
                                    name="time"
                                    className="w-32 rounded-lg border px-3 py-2 text-sm"
                                    defaultValue={
                                        editing
                                            ? new Date(editing.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                                            : ''
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Duration (mins)</label>
                                <input
                                    type="number"
                                    name="durationMins"
                                    defaultValue={
                                        editing
                                            ? Math.max(15, (new Date(editing.end).getTime() - new Date(editing.start).getTime()) / 60000)
                                            : 60
                                    }
                                    min={15}
                                    step={15}
                                    className="mt-1 w-32 rounded-lg border px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setOpen(false); setEditing(null); }}
                                    className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="rounded-xl bg-black px-3 py-2 text-sm text-white hover:opacity-90">
                                    {editing ? 'Save' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
