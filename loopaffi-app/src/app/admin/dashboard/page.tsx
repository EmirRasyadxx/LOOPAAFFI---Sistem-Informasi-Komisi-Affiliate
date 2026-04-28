"use client";

import { useAppStore, mockUsers } from "@/lib/store";
import { formatIDR } from "@/lib/utils";
import {
    TrendingUp,
    Coins,
    ShoppingCart,
    Clock,
    CheckCircle2,
} from "lucide-react";

export default function AdminDashboard() {
    const { sales, commissions, payments } = useAppStore();

    const totalSalesAmount = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalCommissions = commissions.reduce((acc, c) => acc + c.amount, 0);
    const pendingPaymentsTotal = payments.filter((p) => p.status === "pending").reduce((acc, p) => acc + p.amount, 0);
    const paidPaymentsTotal = payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);

    const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    const getAffiliateName = (id: string) => mockUsers.find((u) => u.id === id)?.name ?? "Unknown";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ringkasan</h2>
                <p className="text-slate-500 mt-1">
                    Selamat datang kembali. Berikut adalah aktivitas afiliasi Anda hari ini.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Penjualan", value: formatIDR(totalSalesAmount), sub: `${sales.length} transaksi`, icon: ShoppingCart },
                    { title: "Total Komisi", value: formatIDR(totalCommissions), sub: "Tingkat 10%", icon: Coins },
                    { title: "Pembayaran Tertunda", value: formatIDR(pendingPaymentsTotal), sub: `${payments.filter(p => p.status === "pending").length} tertunda`, icon: Clock },
                    { title: "Telah Dibayar", value: formatIDR(paidPaymentsTotal), sub: `${payments.filter(p => p.status === "paid").length} selesai`, icon: TrendingUp },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Icon className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-600">{stat.title}</h3>
                            </div>
                            <div className="relative z-10">
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{stat.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sales */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Penjualan Terbaru</h3>
                    </div>
                    <div className="p-6">
                        {recentSales.length === 0 ? (
                            <p className="text-slate-500 text-center text-sm py-4">Tidak ada penjualan terbaru.</p>
                        ) : (
                            <div className="space-y-4">
                                {recentSales.map((sale) => (
                                    <div key={sale.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{getAffiliateName(sale.affiliateId)}</p>
                                                <p className="text-xs text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">{formatIDR(sale.amount)}</p>
                                            <p className="text-xs text-red-600 font-medium">+{formatIDR(sale.amount * 0.1)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Aksi Cepat</h3>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                        {[
                            { label: "Catat Penjualan", href: "/admin/sales", desc: "Tambahkan transaksi baru secara manual" },
                            { label: "Proses Pembayaran", href: "/admin/payments", desc: "Tandai pembayaran afiliasi sebagai selesai" },
                            { label: "Lihat Komisi", href: "/admin/commissions", desc: "Lihat semua komisi yang dihasilkan" },
                            { label: "Ekspor Laporan", href: "/admin/reports", desc: "Unduh CSV performa" },
                        ].map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                className="block p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors"
                            >
                                <p className="text-sm font-semibold text-slate-900 mb-1">{action.label}</p>
                                <p className="text-xs text-slate-500">{action.desc}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
