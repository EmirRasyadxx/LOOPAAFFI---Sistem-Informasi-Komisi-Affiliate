"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { currentUser } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const isAuthRoute = pathname === "/login";

        if (!currentUser && !isAuthRoute) {
            router.push("/login");
            return;
        }

        if (currentUser) {
            if (isAuthRoute || pathname === "/") {
                router.push(`/${currentUser.role}/dashboard`);
                return;
            }

            const adminPath = pathname.startsWith("/admin");
            const affiliatePath = pathname.startsWith("/affiliate");

            if (currentUser.role === "admin" && affiliatePath) {
                router.push("/admin/dashboard");
            } else if (currentUser.role === "affiliate" && adminPath) {
                router.push("/affiliate/dashboard");
            }
        }
    }, [currentUser, pathname, router, mounted]);

    if (!mounted) return null;

    const isAuthRoute = pathname === "/login";

    if (isAuthRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 bg-white">
                    {children}
                </main>
            </div>
        </div>
    );
}
