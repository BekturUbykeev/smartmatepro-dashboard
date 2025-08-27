"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, LogOut } from "lucide-react";

function NavLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm
        ${active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const logout = () => {
    // временный «выход»: удаляем куку и редиректим на /login
    document.cookie = "sm_auth=; Max-Age=0; path=/";
    window.location.href = "/login";
  };

  return (
    <aside className="w-60 border-r p-4 space-y-3">
      <div className="text-xl font-bold">SmartMate Pro</div>
      <nav className="space-y-1">
        <NavLink href="/dashboard" Icon={Home} label="Dashboard" />
        <NavLink href="/calendar" Icon={Calendar} label="Calendar" />
      </nav>
      <button
        onClick={logout}
        className="mt-4 flex items-center gap-2 text-sm opacity-75 hover:opacity-100"
      >
        <LogOut size={16} /> Log out
      </button>
    </aside>
  );
}
