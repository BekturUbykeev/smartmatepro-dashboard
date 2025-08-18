// src/app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Today’s Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-muted-foreground">+1 vs yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">7</div>
          <p className="text-sm text-muted-foreground">placeholder</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">2</div>
          <p className="text-sm text-muted-foreground">today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reschedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1</div>
          <p className="text-sm text-muted-foreground">last 24h</p>
        </CardContent>
      </Card>
    </div>
  );
}
