// src/app/appointments/page.tsx
"use client";
import UpcomingList from "@/components/dashboard/UpcomingList";
export default function AppointmentsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4">
            <h1 className="text-2xl font-semibold">Appointments</h1>
            <UpcomingList />
        </div>
    );
}

// src/app/clients/page.tsx
"use client";
import ClientCards from "@/components/dashboard/ClientCards";
export default function ClientsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4">
            <h1 className="text-2xl font-semibold">Clients</h1>
            <ClientCards />
        </div>
    );
}