// src/lib/api.ts
const base = import.meta.env.VITE_API_BASE_URL;

function onlyDate(s?: string) {
    return (s || '').slice(0, 10);
}

async function checkedFetch(url: string) {
    if (!base) throw new Error('base_url_missing');
    const r = await fetch(url);
    const text = await r.clone().text().catch(() => '');
    if (!r.ok) throw new Error(`${r.status} ${text}`);
    return JSON.parse(text);
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
    return checkedFetch(url); // { from, to, events: [...] }
}
