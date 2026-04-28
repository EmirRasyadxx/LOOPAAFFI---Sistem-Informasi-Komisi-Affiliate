"use client";

import { Bell } from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
    const { currentUser, notifications, markNotificationRead } = useAppStore();

    if (!currentUser) return null;

    const userNotifications = notifications.filter((n) => n.userId === currentUser.id);
    const unreadCount = userNotifications.filter((n) => !n.read).length;

    return (
        <header className="h-16 flex items-center justify-end px-8 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-6">
                <DropdownMenu>
                    <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-600">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-80 overflow-y-auto">
                            {userNotifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">Tidak ada notifikasi baru</div>
                            ) : (
                                userNotifications.map((notif) => (
                                    <DropdownMenuItem
                                        key={notif.id}
                                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                        onClick={() => markNotificationRead(notif.id)}
                                    >
                                        <div className="flex items-start justify-between w-full">
                                            <span className={`text-sm ${notif.read ? "text-slate-500" : "text-slate-900 font-medium"}`}>
                                                {notif.message}
                                            </span>
                                            {!notif.read && <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 shrink-0" />}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(notif.date).toLocaleDateString()}
                                        </span>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
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
