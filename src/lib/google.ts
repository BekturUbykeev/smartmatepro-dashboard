// src/lib/google.ts
export async function getCalendarClient() {
    const { google } = await import("googleapis"); // ленивый импорт

    const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64!;
    const jsonString = Buffer.from(b64, "base64").toString("utf-8");
    const creds = JSON.parse(jsonString);

    const auth = new (google as any).auth.JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    return (google as any).calendar({ version: "v3", auth });
}
