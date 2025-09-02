"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import EventForm from "@/components/calendar/EventForm";

export default function QuickCreateButton({ defaultClientId }: { defaultClientId?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="rounded-2xl bg-black px-4 py-2 text-white shadow" onClick={() => setOpen(true)}>
                New appointment
            </button>

            <Modal open={open} onClose={() => setOpen(false)} title="New appointment">
                <EventForm initialClientId={defaultClientId ?? null} onDone={() => setOpen(false)} />
            </Modal>
        </>
    );
}
