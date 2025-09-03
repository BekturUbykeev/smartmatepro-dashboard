// src/app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner"; // ← вместо "@/components/ui/toaster"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors expand /> {/* ← sonner */}
        </Providers>
      </body>
    </html>
  );
}
