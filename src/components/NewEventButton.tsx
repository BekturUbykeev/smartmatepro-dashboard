// src/components/NewEventButton.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import EventForm from "@/components/calendar/EventForm";

export default function NewEventButton({
    defaultClientId,
    defaultDateISO,
    label = "+ New Event",
}: {
    defaultClientId?: string;
    defaultDateISO?: string;
    label?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="rounded-lg border px-3 py-1 text-sm"
                onClick={() => setOpen(true)}
            >
                {label}
            </button>

            <Modal open={open} onClose={() => setOpen(false)} title="New event">
                <EventForm
                    initialClientId={defaultClientId ?? null}
                    initialDateISO={defaultDateISO ?? null}
                    onDone={() => setOpen(false)}
                />
            </Modal>
        </>
    );
}
