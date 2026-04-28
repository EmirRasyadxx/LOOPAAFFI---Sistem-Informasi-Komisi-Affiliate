"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
    BarChart3,
    ShoppingCart,
    Wallet,
    Users,
    FileText,
    LogOut,
    Infinity,
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, logout } = useAppStore();

    if (!currentUser) return null;

    const isAdmin = currentUser.role === "admin";

    const adminLinks = [
        { name: "Dasbor", href: "/admin/dashboard", icon: BarChart3 },
        { name: "Penjualan", href: "/admin/sales", icon: ShoppingCart },
        { name: "Komisi", href: "/admin/commissions", icon: Users },
        { name: "Pembayaran", href: "/admin/payments", icon: Wallet },
        { name: "Laporan", href: "/admin/reports", icon: FileText },
    ];

    const affiliateLinks = [
        { name: "Dasbor", href: "/affiliate/dashboard", icon: BarChart3 },
        { name: "Penjualan Saya", href: "/affiliate/sales", icon: ShoppingCart },
        { name: "Pembayaran", href: "/affiliate/payments", icon: Wallet },
    ];

    const links = isAdmin ? adminLinks : affiliateLinks;

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-white border-r border-slate-200">
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                <div className="flex items-center justify-center bg-red-600 text-white rounded-md p-1.5">
                    <Infinity className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">LoopAffi</h1>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-red-50 text-red-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-red-600" : "text-slate-400")} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                    Keluar
                </button>
            </div>
        </div>
    );
}
