// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartMatePro Dashboard",
  description: "Admin dashboard for SmartMatePro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Topbar />
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
