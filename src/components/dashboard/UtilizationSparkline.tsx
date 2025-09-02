// ============================
// src/components/dashboard/UtilizationSparkline.tsx
// ============================
"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSevenDayUtilization } from "@/app/hooks/useDashboardAnalytics";

export default function UtilizationSparkline() {
    const { loading, points } = useSevenDayUtilization();
    if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />;
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm text-gray-500">Utilization — last 7 days</div>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={points} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <XAxis dataKey="date" tickMargin={6} fontSize={12} />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={32} fontSize={12} />
                        <Tooltip formatter={(v: number) => `${v}%`} />
                        <Line type="monotone" dataKey="util" dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}