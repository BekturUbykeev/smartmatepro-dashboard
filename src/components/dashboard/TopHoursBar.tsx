// ============================
// src/components/dashboard/TopHoursBar.tsx
// ============================
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTopHours } from "@/app/hooks/useDashboardAnalytics";

export default function TopHoursBar() {
    const { loading, bars } = useTopHours();
    if (loading) return <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />;
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm text-gray-500">Top hours (minutes booked)</div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bars} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <XAxis dataKey="label" tickMargin={6} fontSize={12} />
                        <YAxis tickFormatter={(v) => `${Math.round(v / 60)}h`} width={28} fontSize={12} />
                        <Tooltip formatter={(v: number) => `${Math.round((v as number) / 60 * 10) / 10}h`} />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
