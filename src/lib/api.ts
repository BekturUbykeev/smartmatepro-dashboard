// src/lib/api.ts
const base = import.meta.env.VITE_API_BASE_URL;

function onlyDate(s?: string) {
    return (s || '').slice(0, 10);
}

async function checkedFetch(url: string) {
    if (!base) throw new Error('base_url_missing');
    const r = await fetch(url, { credentials: 'include' });
    const text = await r.clone().text().catch(() => '');
    if (!r.ok) throw new Error(`${r.status} ${text}`);
    return text ? JSON.parse(text) : {};
}

// универсальный вариант для PUT/POST/DELETE с телом
async function checkedFetchJSON(url: string, init: RequestInit) {
    if (!base) throw new Error('base_url_missing');
    const r = await fetch(url, { credentials: 'include', ...init });
    const text = await r.clone().text().catch(() => '');
    if (!r.ok) throw new Error(`${r.status} ${text}`);
    // некоторые DELETE могут возвращать пусто
    return text ? JSON.parse(text) : { ok: true };
}

// --- METRICS (для DashboardPage) ---
export async function fetchMetrics() {
    const url = `${base}/api/metrics`;
    return checkedFetch(url);
}

// --- SLOTS (используется в бронировании) ---
export async function fetchSlots(dateISO: string) {
    const url = `${base}/api/slots?date=${encodeURIComponent(onlyDate(dateISO))}`;
    return checkedFetch(url);
}

// --- EVENTS (для CalendarPage) ---
export async function fetchEvents(fromISO: string, toISO: string) {
    const from = onlyDate(fromISO);
    const to = onlyDate(toISO);
    const url = `${base}/api/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    return checkedFetch(url); // ожидается { from, to, events: [...] }
}

/**
 * UPDATE с фоллбэками:
 * 1) PUT   /api/events/:id
 * 2) PATCH /api/events/:id
 * 3) POST  /api/events/:id
 * 4) POST  /api/events/update   { id, ... }
 * 5) POST  /api/events          { action:'update', id, ... }
 */
export async function updateEvent(
    id: string,
    payload: { summary: string; description?: string; start: string; end: string }
) {
    const headers = { 'Content-Type': 'application/json' };
    const tries: Array<() => Promise<any>> = [
        () =>
            checkedFetchJSON(`${base}/api/events/${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(payload),
            }),
        () =>
            checkedFetchJSON(`${base}/api/events/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(payload),
            }),
        () =>
            checkedFetchJSON(`${base}/api/events/${encodeURIComponent(id)}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            }),
        () =>
            checkedFetchJSON(`${base}/api/events/update`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ id, ...payload }),
            }),
        () =>
            checkedFetchJSON(`${base}/api/events`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ action: 'update', id, ...payload }),
            }),
    ];

    let lastErr: any;
    for (const fn of tries) {
        try {
            return await fn();
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr;
}

/**
 * DELETE с фоллбэками:
 * 1) DELETE /api/events/:id
 * 2) POST   /api/events/:id/delete
 * 3) POST   /api/events/delete  { id }
 * 4) POST   /api/events         { action:'delete', id }
 */
export async function deleteEvent(id: string) {
    const headers = { 'Content-Type': 'application/json' };
    const tries: Array<() => Promise<any>> = [
        () =>
            checkedFetchJSON(`${base}/api/events/${encodeURIComponent(id)}`, {
                method: 'DELETE',
            }),
        () =>
            checkedFetchJSON(`${base}/api/events/${encodeURIComponent(id)}/delete`, {
                method: 'POST',
            }),
        () =>
            checkedFetchJSON(`${base}/api/events/delete`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ id }),
            }),
        () =>
            checkedFetchJSON(`${base}/api/events`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ action: 'delete', id }),
            }),
    ];

    let lastErr: any;
    for (const fn of tries) {
        try {
            return await fn();
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr;
}
