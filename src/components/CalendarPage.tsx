// src/components/CalendarPage.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { fetchEvents, updateEvent, deleteEvent } from '../lib/api';
import { DateTime } from 'luxon';

type ViewType = 'Week' | 'Month' | 'Day' | 'List';
type Density = 'compact' | 'cozy' | 'comfortable';
type ApiEvent = { id: string; summary: string; description?: string; start: string; end: string };

export function CalendarPage() {
  const tz = 'America/Los_Angeles';

  // === настройка «плотности» строк и диапазона часов
  const [density, setDensity] = useState<Density>('compact'); // compact=40, cozy=48, comfortable=56
  const rowPx = density === 'compact' ? 40 : density === 'cozy' ? 48 : 56;

  const [startHour, setStartHour] = useState(7);
  const [endHour, setEndHour] = useState(19);

  // === состояние
  const [currentView, setCurrentView] = useState<ViewType>('Week');
  const [anchor, setAnchor] = useState(DateTime.now().setZone(tz));
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // edit modal
  const [selected, setSelected] = useState<ApiEvent | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const nowLineTimer = useRef<number | null>(null);
  const [nowTick, setNowTick] = useState(0); // тикаем каждую минуту, чтобы линия "сейчас" сдвигалась

  // вычисляем неделю (ISO: понедельник)
  const weekDays = useMemo(() => {
    const start = anchor.startOf('week');
    return Array.from({ length: 7 }).map((_, i) => start.plus({ days: i }));
  }, [anchor]);

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour + 1 }).map((_, i) => startHour + i),
    [startHour, endHour]
  );

  // загрузка событий для недели
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

  // линия «сейчас» — тикаем каждую минуту
  useEffect(() => {
    if (nowLineTimer.current) window.clearInterval(nowLineTimer.current);
    nowLineTimer.current = window.setInterval(() => setNowTick((n) => n + 1), 60_000);
    return () => {
      if (nowLineTimer.current) window.clearInterval(nowLineTimer.current);
    };
  }, []);

  // автоскролл после загрузки или смены часов/недели
  useEffect(() => {
    if (!scrollRef.current) return;
    const now = DateTime.now().setZone(tz);
    const isSameWeek = now.hasSame(anchor, 'week');
    let targetMinuteFromTop: number | null = null;

    if (isSameWeek) {
      targetMinuteFromTop = Math.max(0, (now.hour - startHour) * 60 + now.minute);
    } else if (events.length > 0) {
      const first = events
        .slice()
        .sort((a, b) => DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis())[0];
      const s = DateTime.fromISO(first.start).setZone(tz);
      targetMinuteFromTop = Math.max(0, (s.hour - startHour) * 60 + s.minute);
    } else {
      targetMinuteFromTop = 0;
    }

    const px = (targetMinuteFromTop / 60) * rowPx;
    scrollRef.current.scrollTop = Math.max(0, px - rowPx * 1.5);
  }, [events, startHour, endHour, rowPx, anchor, nowTick]);

  // позиционирование карточки события
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

  // позиция для красной линии "сейчас" в текущем дне
  function nowLineTopPx(day: DateTime) {
    const now = DateTime.now().setZone(tz);
    if (!now.hasSame(day, 'day')) return null;
    if (now.hour < startHour || now.hour > endHour) return null;
    const minutesFromStart = (now.hour - startHour) * 60 + now.minute;
    return (minutesFromStart / 60) * rowPx;
  }

  const title = anchor.toFormat('LLLL yyyy');

  async function reloadWeek() {
    const from = weekDays[0].startOf('day').toISODate()!;
    const to = weekDays[6].endOf('day').toISODate()!;
    const data = await fetchEvents(from, to);
    setEvents(data.events || []);
  }

  // локальный helper: из значения datetime-local -> ISO в целевом TZ
  function localInputToISO(v: string) {
    const dt = DateTime.fromFormat(v, "yyyy-LL-dd'T'HH:mm", { zone: tz });
    return dt.isValid ? dt.toISO()! : v;
  }

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setModalError(null);
    try {
      // оптимистично обновим локально
      setEvents(prev => prev.map(e => (e.id === selected.id ? { ...selected } : e)));
      await updateEvent(selected.id, {
        summary: selected.summary,
        description: selected.description ?? '',
        start: selected.start,
        end: selected.end,
      });
      await reloadWeek();
      setSelected(null);
    } catch (e: any) {
      console.error('update failed', e);
      setModalError(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!selected) return;
    setDeleting(true);
    setModalError(null);
    try {
      // оптимистично уберём из списка
      setEvents(prev => prev.filter(e => e.id !== selected.id));
      await deleteEvent(selected.id);
      await reloadWeek();
      setSelected(null);
    } catch (e: any) {
      console.error('delete failed', e);
      setModalError(String(e?.message || e));
    } finally {
      setDeleting(false);
    }
  }

  function gotoChat() {
    if (!selected) return;
    const url = selected.description?.includes('clientId=')
      ? `/chats?${selected.description}`
      : `/chats?eventId=${selected.id}`;
    window.location.href = url;
  }

  function goToday() {
    setAnchor(DateTime.now().setZone(tz));
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-white">
      {/* Шапка */}
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

            <Button variant="outline" className="ml-2 h-8" onClick={goToday}>Today</Button>
          </div>

          <div className="flex items-center gap-2">
            {/* View tabs (заглушка) */}
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

            {/* Диапазон часов (пресеты) */}
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

      {/* Рабочая область (скролл здесь) */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto">
        <div className="mx-auto w-full max-w-[1200px] min-w-[900px]">
          {/* Заголовок дней — прилипающий */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="p-3 text-xs text-gray-400"></div>
            {weekDays.map((d, i) => {
              const isToday = DateTime.now().setZone(tz).hasSame(d, 'day');
              return (
                <div key={i} className={`p-3 text-center border-l border-gray-200 ${isToday ? 'bg-blue-50/40' : ''}`}>
                  <div className={`text-lg ${isToday ? 'text-blue-700 font-semibold' : 'text-black'}`}>{d.toFormat('d')}</div>
                  <div className={`text-xs ${isToday ? 'text-blue-700' : 'text-gray-400'}`}>{d.toFormat('ccc')}</div>
                </div>
              );
            })}
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

            {/* Слой событий (кликабелен) */}
            <div className="absolute inset-0">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] h-full">
                <div />
                {weekDays.map((day, dayIdx) => {
                  const dayEvents = events.filter(e => DateTime.fromISO(e.start).hasSame(day, 'day'));
                  const lineTop = nowLineTopPx(day);

                  return (
                    <div key={dayIdx} className="relative">
                      {/* Красная линия «сейчас» */}
                      {lineTop !== null && (
                        <div
                          style={{ top: lineTop }}
                          className="absolute left-1 right-1 h-[2px] bg-red-500"
                        />
                      )}

                      {/* События */}
                      {dayEvents.map(ev => (
                        <div
                          key={ev.id}
                          className="absolute left-1 right-1 text-white rounded-md p-2 text-xs shadow
                                     cursor-pointer hover:shadow-md active:scale-[0.99]"
                          style={{
                            ...eventStyle(ev),
                            // осветляем #0066FF примерно на 25%
                            backgroundColor: 'color-mix(in srgb, #0066FF 75%, white 25%)'
                          }}
                          title={ev.summary}
                          onClick={() => {
                            setModalError(null);
                            setSaving(false);
                            setDeleting(false);
                            setSelected(ev);
                          }}
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
          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0066FF] text-white rounded-full flex items-center justify-center hover:scale-105 transition-all"
        aria-label="Create event"
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

      {/* Edit event */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-black">Edit appointment</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              {modalError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                  {modalError}
                </div>
              )}

              <label className="block">
                <span className="text-sm text-gray-600">Title</span>
                <input
                  className="mt-1 w-full border rounded-md px-3 py-2"
                  value={selected.summary}
                  onChange={e => setSelected({ ...selected, summary: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Description (e.g., clientId=123&source=wa)</span>
                <input
                  className="mt-1 w-full border rounded-md px-3 py-2"
                  value={selected.description ?? ''}
                  onChange={e => setSelected({ ...selected, description: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-600">Start</span>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={DateTime.fromISO(selected.start).setZone(tz).toFormat("yyyy-LL-dd'T'HH:mm")}
                    onChange={e =>
                      setSelected({
                        ...selected,
                        start: localInputToISO(e.target.value)
                      })}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">End</span>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={DateTime.fromISO(selected.end).setZone(tz).toFormat("yyyy-LL-dd'T'HH:mm")}
                    onChange={e =>
                      setSelected({
                        ...selected,
                        end: localInputToISO(e.target.value)
                      })}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={onDelete} disabled={saving || deleting}>
                    {deleting ? 'Deleting…' : 'Delete'}
                  </Button>
                  <Button variant="outline" onClick={gotoChat} disabled={saving || deleting}>Open chat</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelected(null)} disabled={saving || deleting}>Cancel</Button>
                  <Button onClick={onSave} disabled={saving || deleting}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
