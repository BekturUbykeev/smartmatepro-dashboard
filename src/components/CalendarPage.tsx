// src/components/CalendarPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { fetchEvents } from '../lib/api';
import { DateTime } from 'luxon';

type ViewType = 'Week' | 'Month' | 'Day' | 'List';
type Density = 'compact' | 'cozy' | 'comfortable';
type ApiEvent = { id: string; summary: string; description?: string; start: string; end: string };

export function CalendarPage() {
  const tz = 'America/Los_Angeles';

  // === настраиваемая «плотность» строк и диапазон часов
  const [density, setDensity] = useState<Density>('compact');      // compact=40, cozy=48, comfortable=56
  const rowPx = density === 'compact' ? 40 : density === 'cozy' ? 48 : 56;

  const [startHour, setStartHour] = useState(7);  // можно поставить 8 если надо ещё компактнее
  const [endHour, setEndHour] = useState(19);     // 18 = ещё меньше высота

  // === состояние
  const [currentView, setCurrentView] = useState<ViewType>('Week');
  const [anchor, setAnchor] = useState(DateTime.now().setZone(tz));
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const weekDays = useMemo(() => {
    const start = anchor.startOf('week'); // ISO: Monday
    return Array.from({ length: 7 }).map((_, i) => start.plus({ days: i }));
  }, [anchor]);

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour + 1 }).map((_, i) => startHour + i),
    [startHour, endHour]
  );

  useEffect(() => {
    if (currentView !== 'Week') return;
    (async () => {
      try {
        setLoading(true); setError(null);
        const from = weekDays[0].startOf('day').toISODate()!;
        const to = weekDays[6].endOf('day').toISODate()!;
        const data = await fetchEvents(from, to);
        setEvents(data.events || []);
      } catch (e) {
        console.error(e);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentView, weekDays]);

  function eventStyle(ev: ApiEvent) {
    const s = DateTime.fromISO(ev.start).setZone(tz);
    const e = DateTime.fromISO(ev.end).setZone(tz);
    const minutesFromStart = (s.hour - startHour) * 60 + s.minute;
    const hMin = Math.max(30, e.diff(s, 'minutes').minutes);
    return {
      top: `${(minutesFromStart / 60) * rowPx}px`,
      height: `${(hMin / 60) * rowPx}px`,
    };
  }

  const title = anchor.toFormat('LLLL yyyy');

  return (
    // ВАЖНО: flex-колонка, min-h-0, чтобы внутренний скролл работал
    <div className="h-full min-h-0 flex flex-col bg-white">
      {/* Узкая шапка (fixed height) */}
      <div className="flex-none px-5 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-50 rounded-lg" onClick={() => setAnchor(a => a.minus({ weeks: 1 }))}>
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <span className="text-base min-w-[160px] text-center text-black">{title}</span>
            <button className="p-2 hover:bg-gray-50 rounded-lg" onClick={() => setAnchor(a => a.plus({ weeks: 1 }))}>
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View tabs (пока заглушка) */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
              {(['Week', 'Month', 'Day', 'List'] as ViewType[]).map(v => (
                <button
                  key={v}
                  onClick={() => setCurrentView(v)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${currentView === v ? 'bg-white text-black border-gray-200' : 'text-gray-500 hover:text-gray-900 border-transparent'
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Плотность */}
            <select
              value={density}
              onChange={e => setDensity(e.target.value as Density)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
              title="Row density"
            >
              <option value="compact">Compact</option>
              <option value="cozy">Cozy</option>
              <option value="comfortable">Comfortable</option>
            </select>

            {/* Диапазон часов (быстрые пресеты) */}
            <select
              onChange={(e) => {
                const v = e.target.value;
                if (v === '7-19') { setStartHour(7); setEndHour(19); }
                if (v === '8-18') { setStartHour(8); setEndHour(18); }
                if (v === '9-17') { setStartHour(9); setEndHour(17); }
              }}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
              defaultValue="7-19"
              title="Visible hours"
            >
              <option value="7-19">7–19</option>
              <option value="8-18">8–18</option>
              <option value="9-17">9–17</option>
            </select>
          </div>
        </div>
      </div>

      {/* Рабочая область — занимает остаток, внутри свой скролл */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="mx-auto w-full max-w-[1200px] min-w-[900px]">
          {/* Заголовок дней — прилипающий */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="p-3 text-xs text-gray-400"></div>
            {weekDays.map((d, i) => (
              <div key={i} className="p-3 text-center border-l border-gray-200">
                <div className="text-lg text-black">{d.toFormat('d')}</div>
                <div className="text-xs text-gray-400">{d.toFormat('ccc')}</div>
              </div>
            ))}
          </div>

          {/* Сетка времени */}
          <div className="relative">
            {hours.map(h => (
              <div
                key={h}
                className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100"
                style={{ height: `${rowPx}px` }}
              >
                <div className="p-2 text-xs text-gray-400 text-right pr-4">
                  {DateTime.fromObject({ hour: h }).toFormat('t')}
                </div>
                {weekDays.map((_, idx) => (
                  <div key={idx} className="border-l border-gray-100 hover:bg-gray-50/40 transition-colors" />
                ))}
              </div>
            ))}

            {/* Слой событий */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] h-full">
                <div />
                {weekDays.map((day, dayIdx) => {
                  const dayEvents = events.filter(e => DateTime.fromISO(e.start).hasSame(day, 'day'));
                  return (
                    <div key={dayIdx} className="relative">
                      {dayEvents.map(ev => (
                        <div
                          key={ev.id}
                          className="absolute left-1 right-1 bg-[#0066FF] text-white rounded-md p-2 text-xs shadow pointer-events-auto"
                          style={eventStyle(ev)}
                          title={ev.summary}
                        >
                          <div className="opacity-90">
                            {DateTime.fromISO(ev.start).toFormat('t')}–{DateTime.fromISO(ev.end).toFormat('t')}
                          </div>
                          <div className="font-medium truncate">{ev.summary}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {loading && <div className="p-4 text-sm text-gray-500">Loading events…</div>}
          {error && <div className="p-4 text-sm text-red-500">{error}</div>}

          {/* Немного паддинга внизу, чтоб последняя строка не прилипала к краю */}
          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0066FF] text-white rounded-full flex items-center justify-center hover:scale-105 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Диалог создания (заглушка) */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-black">New Event</DialogTitle></DialogHeader>
          <div className="text-sm text-gray-500">Позже добавим создание события через API.</div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
