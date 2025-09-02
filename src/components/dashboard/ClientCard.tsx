"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import EventForm from "@/components/calendar/EventForm";

type Client = {
    id: string;
    name: string;
    phone?: string;
    lastVisit?: string; // ISO
    note?: string;
};

export default function ClientCard({ client }: { client: Client }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-medium">{client.name}</div>
                    {client.lastVisit && (
                        <div className="text-xs text-gray-500">Last visit: {new Date(client.lastVisit).toLocaleDateString()}</div>
                    )}
                    {client.note && <div className="text-xs text-gray-500">{client.note}</div>}
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => setOpen(true)}>Book</button>
                    <button className="rounded-lg border px-3 py-1 text-sm" disabled>Reschedule</button>
                    <button className="rounded-lg border px-3 py-1 text-sm" disabled>Message</button>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={`Book for ${client.name}`}>
                <EventForm initialClientId={client.id} onDone={() => setOpen(false)} />
            </Modal>
        </div>
    );
}
