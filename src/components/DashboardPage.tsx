import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Users, DollarSign, Calendar as CalIcon } from 'lucide-react';
import { Card } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchMetrics, fetchEvents } from '../lib/api';
import { DateTime } from 'luxon';

type EventItem = {
  id: string;
  summary: string;
  description: string;
  start: string; // ISO
  end: string;   // ISO
};

type Metrics = {
  todayBookings: number;
  weekBookings: number;
  uniqueClientsWeek: number;
  utilizationRate: number;
  revenue?: number;
};

function extractClientId(desc: string): string | null {
  const m = desc?.match(/SmartMatePro ID:\s*([^\s]+)/i);
  return m?.[1] || null;
}

function humanNameFromSummary(summary: string): string {
  const m = summary?.match(/^Appointment:\s*(.+)$/i);
  return (m?.[1] || summary || '').trim();
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [m, setM] = useState<Metrics | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [upcoming, setUpcoming] = useState<EventItem[]>([]); // <— будущие события

  // диапазон: 7 дней до конца сегодняшнего дня
  const tz = 'America/Los_Angeles';
  const todayStart = useMemo(() => DateTime.now().setZone(tz).startOf('day'), []);
  const weekStart = useMemo(() => todayStart.minus({ days: 6 }).startOf('day'), [todayStart]);
  const weekEnd = useMemo(() => todayStart.endOf('day'), [todayStart]);

  // Метрики + события прошедшей недели (для графика и «сегодня»)
  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const metrics = await fetchMetrics();
        setM(metrics);

        const evResp = await fetchEvents(weekStart.toISO()!, weekEnd.toISO()!);
        setEvents(evResp.events || []);
      } catch (e: any) {
        console.error('[Dashboard] load failed:', e);
        setErr('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, [weekStart, weekEnd]);

  // Будущие события: сейчас → +14 дней
  useEffect(() => {
    (async () => {
      try {
        const now = DateTime.now().setZone(tz);
        const horizon = now.plus({ days: 14 }).endOf('day');
        const resp = await fetchEvents(now.toISO()!, horizon.toISO()!);
        setUpcoming(resp.events || []);
      } catch (e) {
        console.error('[Dashboard] load upcoming failed:', e);
      }
    })();
  }, []);

  // ==== График по дням недели (из прошедших 7 дней) ====
  const weekData = useMemo(() => {
    const bucket = new Map<string, number>(); // yyyy-MM-dd -> count
    for (let i = 0; i < 7; i++) {
      const d = weekStart.plus({ days: i });
      bucket.set(d.toISODate()!, 0);
    }
    events.forEach(ev => {
      const d = DateTime.fromISO(ev.start, { zone: tz }).toISODate();
      if (d && bucket.has(d)) bucket.set(d, (bucket.get(d) || 0) + 1);
    });
    return Array.from(bucket.entries()).map(([iso, cnt]) => ({
      day: DateTime.fromISO(iso, { zone: tz }).toFormat('ccc'),
      bookings: cnt,
      revenue: (cnt * 80),
    }));
  }, [events, weekStart]);

  // ==== Сегодняшние записи ====
  const todaySchedule = useMemo(() => {
    return events
      .filter(ev => DateTime.fromISO(ev.start, { zone: tz }).hasSame(todayStart, 'day'))
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .map(ev => ({
        id: ev.id,
        time: DateTime.fromISO(ev.start, { zone: tz }).toFormat('HH:mm'),
        client: humanNameFromSummary(ev.summary),
        service: '',
        status: 'confirmed' as const,
      }));
  }, [events, todayStart]);

  // ==== Предстоящие записи (следующие 14 дней) ====
  const upcomingList = useMemo(() => {
    const now = DateTime.now().setZone(tz);
    return (upcoming || [])
      .filter(ev => DateTime.fromISO(ev.start, { zone: tz }) >= now)
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .map(ev => {
        const start = DateTime.fromISO(ev.start, { zone: tz });
        return {
          id: ev.id,
          at: start.toFormat('ccc, MMM d • HH:mm'),
          client: humanNameFromSummary(ev.summary),
          clientId: extractClientId(ev.description || '') || humanNameFromSummary(ev.summary),
          service: '',
        };
      });
  }, [upcoming]);

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl mb-2 text-black">Dashboard</h1>
        <p className="text-sm text-gray-400">Welcome back, here's what's happening</p>
        {err ? <div className="mt-2 text-xs text-red-500">{err}</div> : null}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <CalIcon className="w-5 h-5 text-[#0066FF]" />
            </div>
            <span className="text-xs text-[#10B981] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              12%
            </span>
          </div>
          <div className="text-2xl mb-1 text-black">{loading ? '—' : (m?.todayBookings ?? 0)}</div>
          <div className="text-sm text-gray-400">Bookings</div>
        </Card>

        <Card className="p-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#8B5CF6]" />
            </div>
          </div>
          <div className="text-2xl mb-1 text-black">{loading ? '—' : (m?.uniqueClientsWeek ?? 0)}</div>
          <div className="text-sm text-gray-400">Clients (7d)</div>
        </Card>

        <Card className="p-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>
          <div className="text-2xl mb-1 text-black">
            {loading ? '—' : `$${(m?.revenue ?? (m?.weekBookings ?? 0) * 80)}`}
          </div>
          <div className="text-sm text-gray-400">Revenue (7d)</div>
        </Card>

        <Card className="p-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <div className="text-[#F59E0B]">⚡</div>
            </div>
          </div>
          <div className="text-2xl mb-1 text-black">
            {loading ? '—' : `${Math.round((m?.utilizationRate ?? 0) * 100)}%`}
          </div>
          <div className="text-sm text-gray-400">Automation</div>
        </Card>
      </div>

      {/* Weekly Overview (реальные данные) */}
      <Card className="p-6 bg-white border border-gray-200 mb-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base mb-1 text-black">Weekly Overview</h3>
            <p className="text-sm text-gray-400">Bookings and revenue trends</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#0066FF]"></div>
              <span className="text-gray-500">Bookings</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={weekData}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }} />
            <Area type="monotone" dataKey="bookings" stroke="#0066FF" strokeWidth={2} fill="url(#colorBookings)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Today's Schedule (реальные данные) */}
      <Card className="p-6 bg-white border border-gray-200 mb-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <h3 className="text-base mb-4 text-black">Today's Schedule</h3>
        <div className="space-y-2">
          {todaySchedule.length === 0 && <div className="text-sm text-gray-400">No bookings today</div>}
          {todaySchedule.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-sm text-gray-500 w-14">{a.time}</div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex-1">
                <div className="text-sm mb-0.5 text-black">{a.client}</div>
                {a.service ? <div className="text-xs text-gray-400">{a.service}</div> : null}
              </div>
              <div className="px-3 py-1 rounded-full text-xs bg-[#10B981]/10 text-[#10B981]">
                Confirmed
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming bookings (next 14 days) */}
      <Card className="p-6 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <h3 className="text-base mb-4 text-black">Upcoming bookings (next 14 days)</h3>

        {upcomingList.length === 0 && (
          <div className="text-sm text-gray-400">No upcoming bookings</div>
        )}

        <div className="space-y-2">
          {upcomingList.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-48 text-sm text-gray-500">{u.at}</div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex-1">
                <div className="text-sm mb-0.5 text-black">{u.client}</div>
                {u.service ? <div className="text-xs text-gray-400">{u.service}</div> : null}
              </div>
              <div className="text-xs text-gray-500">{u.clientId}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
