// src/app/(app)/calendar/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventForm from "@/components/calendar/EventForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { EventItem } from "@/app/hooks/useEvents";

export default function CalendarPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<EventItem | null>(null);

    const handleNew = () => {
        setEditing(null);
        setOpen(true);
    };
    const handleEdit = (evt: EventItem) => {
        setEditing(evt);
        setOpen(true);
    };
    const handleDone = () => setOpen(false);

    return (
        <div className="px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Calendar</h1>
                <Button onClick={handleNew}>+ New Event</Button>
            </div>

            {/* Календарь на всю ширину */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <CalendarGrid onEditEvent={handleEdit} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit appointment" : "New appointment"}</DialogTitle>
                    </DialogHeader>

                    {/* ВАЖНО: твой EventForm принимает initialEvent и onDone */}
                    <EventForm
                        initialEvent={editing ?? undefined}
                        onDone={handleDone}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
