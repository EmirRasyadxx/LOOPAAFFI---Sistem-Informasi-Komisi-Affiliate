"use client";

import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
    const { currentUser, notifications, setNotifications, markNotificationRead } = useAppStore();

    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/v1";
                const response = await fetch(`${apiUrl}/notifications`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (result.status === "success") {
                    setNotifications(result.data || []);
                }
            } catch (err) {
                console.error("Gagal mengambil notifikasi:", err);
            }
        };

        fetchNotifications();
        // Polling setiap 30 detik
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [currentUser, setNotifications]);

    const handleMarkRead = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/v1";
            await fetch(`${apiUrl}/notifications/${id}/read`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            markNotificationRead(id);
        } catch (err) {
            console.error("Gagal menandai notifikasi dibaca:", err);
        }
    };

    if (!currentUser) return null;

    const unreadCount = (notifications || []).filter((n) => n && !n.is_read).length;

    return (
        <header className="h-16 flex items-center justify-end px-8 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-6">
                <DropdownMenu>
                    <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-600 focus:outline-none">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-80 overflow-y-auto">
                                {(notifications || []).length === 0 ? (
                                    <div className="p-4 text-center text-sm text-slate-500">Tidak ada notifikasi baru</div>
                                ) : (
                                    (notifications || []).map((notif) => notif && (
                                        <DropdownMenuItem
                                            key={notif.id}
                                            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                            onClick={() => handleMarkRead(notif.id)}
                                        >
                                            <div className="flex items-start justify-between w-full">
                                                <span className={`text-sm ${notif.is_read ? "text-slate-500" : "text-slate-900 font-medium"}`}>
                                                    {notif.message}
                                                </span>
                                                {!notif.is_read && <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 shrink-0" />}
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : ""}
                                            </span>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </div>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 mt-1 capitalize">{currentUser.role}</p>
                    </div>
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-700 font-bold">
                        {currentUser.name.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
}
