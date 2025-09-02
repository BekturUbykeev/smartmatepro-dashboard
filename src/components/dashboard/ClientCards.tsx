"use client";

import ClientCard from "./ClientCard";

const demo = [
    { id: "alexey", name: "Alexey", note: "likes 2 PM", lastVisit: "" },
    { id: "maria", name: "Maria" },
    { id: "john", name: "John" },
];

export default function ClientCards() {
    return (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {demo.map(c => <ClientCard key={c.id} client={c} />)}
        </div>
    );
}
