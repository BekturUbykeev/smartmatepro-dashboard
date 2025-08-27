import { NextResponse } from "next/server";

export type Client = {
    id: string;
    name: string;
    lastMsg: string;
    status: "active" | "pending";
};

const clients: Client[] = [
    { id: "1", name: "Alexey", lastMsg: "Хочу на 14:00 завтра", status: "active" },
    { id: "2", name: "Maria", lastMsg: "Можно перенести на пятницу?", status: "pending" },
    { id: "3", name: "John", lastMsg: "See you at 4 PM", status: "active" },
];

export async function GET() {
    return NextResponse.json({ clients });
}
