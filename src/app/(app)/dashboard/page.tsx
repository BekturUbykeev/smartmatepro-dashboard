// src/app/(app)/dashboard/page.tsx
import Link from "next/link";

const clients = [
    { id: "alexey", name: "Alexey", status: "active", note: "Хочу на 14:00 завтра" },
    { id: "maria", name: "Maria", status: "pending", note: "Можно перенести на пятницу?" },
    { id: "john", name: "John", status: "active", note: "See you at 4 PM" },
];

export default function DashboardPage() {
    return (
        <div className="mx-auto w-full max-w-screen-2xl">
            <h1 className="mb-6 text-2xl font-semibold">Clients ({clients.length})</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clients.map((c) => (
                    <Link
                        key={c.id}
                        href={`/clients/${c.id}`}
                        className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
                    >
                        <div className="text-lg font-semibold">{c.name}</div>
                        <div className="mt-1 text-sm text-gray-500">Status: {c.status}</div>
                        <div className="mt-2 text-sm">{c.note}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
