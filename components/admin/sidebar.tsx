"use client";

import { cn } from "@/lib/utils";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: FolderTree },
  { label: "محصولات", href: "/admin/products", icon: Package },
  { label: "سفارش‌ها", href: "/admin/orders", icon: ShoppingBag },
  { label: "تنظیمات", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-l border-stone-200 bg-white flex flex-col sticky top-0 h-screen">
      <div className="px-6 py-5 border-b border-stone-100">
        <p className="text-lg font-semibold text-stone-900">Solice</p>
        <p className="text-xs text-stone-400 mt-0.5">پنل مدیریت</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-stone-100 space-y-1">
        <div className="px-3 py-2">
          <p className="text-xs text-stone-400">مدیر سیستم</p>
          <p className="text-sm font-medium text-stone-900 truncate">
            {userName}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          خروج
        </button>
      </div>
    </aside>
  );
}
