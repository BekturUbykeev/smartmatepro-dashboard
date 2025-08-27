"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // временная авторизация: ставим куку на 7 дней и идём в /dashboard
        document.cookie = `sm_auth=1; Max-Age=${60 * 60 * 24 * 7}; path=/`;
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen w-full grid place-items-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit">
                            Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
