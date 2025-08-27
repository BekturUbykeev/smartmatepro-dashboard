// src/app/(app)/clients/[id]/page.tsx
import Link from "next/link";

export default async function ClientPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params; // ⬅️ важно
    const displayName = id.charAt(0).toUpperCase() + id.slice(1);

    return (
        <div className="mx-auto w-full max-w-screen-xl">
            <div className="mb-4 text-sm text-gray-500">
                <Link href="/dashboard" className="hover:underline">← Back to Dashboard</Link>
            </div>

            <h1 className="text-2xl font-semibold">{displayName}</h1>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-gray-200 md:col-span-2">
                    <div className="text-sm text-gray-500">Recent messages</div>
                    <div className="mt-2 text-sm text-gray-800">— (placeholder)</div>
                </div>

                <div className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-gray-200">
                    <div className="text-sm text-gray-500">Quick actions</div>
                    <div className="mt-3 space-y-2">
                        <button className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Book for today</button>
                        <button className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Reschedule</button>
                        <button className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
