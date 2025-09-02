// src/components/calendar/EventForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useEvents, type EventItem } from "@/app/hooks/useEvents";
import { useAvailability } from "@/app/hooks/useAvailability";
import { toast } from "sonner";

import { TZ, dt, dayRange } from "@/lib/tz";

export default function EventForm({
    initialClientId,
    initialDateISO,
    initialEvent, // ← для редактирования
    onDone,
}: {
    initialClientId?: string | null;
    initialDateISO?: string | null;
    initialEvent?: EventItem;
    onDone?: () => void;
}) {
    // Поля формы: подставляем из initialEvent, если есть
    const [clientId, setClientId] = useState(
        initialClientId ?? initialEvent?.clientId ?? ""
    );
    const [dateISO, setDateISO] = useState(
        initialDateISO ??
        initialEvent?.start?.slice(0, 10) ??
        dt().toISODate()
    );
    const [title, setTitle] = useState(initialEvent?.title ?? "Appointment");

    // Диапазон для загрузки событий за день
    const fromISO = useMemo(
        () => dt(dateISO!).startOf("day").toISO(),
        [dateISO]
    );
    const toISO = useMemo(
        () => dt(dateISO!).endOf("day").toISO(),
        [dateISO]
    );

    const { list, create, update, remove } = useEvents({ fromISO, toISO });
    const eventsForDay = list.data ?? [];
    const slots = useAvailability(dateISO!, eventsForDay);

    // Если редактируем — выбрать слот с совпадающим временем
    const initialSlotIndex = useMemo(() => {
        if (!initialEvent) return 0;
        const s = dt(initialEvent.start);
        const idx = slots.findIndex(
            (x) => x.start.hasSame(s, "hour") && x.start.hasSame(s, "minute")
        );
        return idx >= 0 ? idx : 0;
    }, [initialEvent, slots]);

    const [slotIndex, setSlotIndex] = useState<number>(initialSlotIndex);
    useEffect(() => setSlotIndex(initialSlotIndex), [initialSlotIndex]);

    const isEdit = !!initialEvent;

    // Локальные флаги для UX
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const slot = slots[slotIndex];

        // Простая валидация
        if (!slot) {
            toast.error("Нет доступного слота");
            return;
        }
        if (!clientId) {
            toast.error("Укажи Client ID");
            return;
        }

        setSubmitting(true);
        try {
            await toast.promise(
                isEdit && initialEvent
                    ? update.mutateAsync({
                        id: initialEvent.id,
                        title,
                        start: slot.start.toISO(),
                        end: slot.end.toISO(),
                    })
                    : create.mutateAsync({
                        title,
                        start: slot.start.toISO(),
                        end: slot.end.toISO(),
                        clientId,
                    }),
                {
                    loading: isEdit ? "Updating..." : "Saving...",
                    success: isEdit ? "Appointment updated" : "Appointment created",
                    error: (e: any) => e?.message ?? "Error, try again",
                }
            );

            onDone?.(); // закроет модалку
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!initialEvent) return;

        setDeleting(true);
        try {
            await toast.promise(remove.mutateAsync(initialEvent.id), {
                loading: "Deleting...",
                success: "Appointment deleted",
                error: (e: any) => e?.message ?? "Error, try again",
            });
            onDone?.();
        } finally {
            setDeleting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
                <label className="text-sm font-medium">Client ID</label>
                <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="client_123"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">Date</label>
                <input
                    type="date"
                    className="w-full rounded-lg border px-3 py-2"
                    value={dateISO ?? ""}
                    onChange={(e) => setDateISO(e.target.value)}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">Time</label>
                <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={slotIndex}
                    onChange={(e) => setSlotIndex(Number(e.target.value))}
                    disabled={slots.length === 0 || submitting}
                >
                    {slots.length === 0 ? (
                        <option>Нет доступных слотов</option>
                    ) : (
                        slots.map((s, i) => (
                            <option key={i} value={i}>
                                {s.start.setZone(TZ).toFormat("HH:mm")} —{" "}
                                {s.end.setZone(TZ).toFormat("HH:mm")}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between">
                {isEdit ? (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-xl border px-4 py-2 text-sm"
                        disabled={deleting || submitting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                ) : (
                    <span />
                )}
                <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2 text-white"
                    disabled={submitting || list.isLoading || slots.length === 0}
                >
                    {submitting ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update" : "Save"}
                </button>
            </div>
        </form>
    );
}
