"use client";

import { useState, useEffect } from "react";
import { formatIDR } from "@/lib/utils";
import { fetchAdminCommissions, fetchAdminPayments, fetchAdminUsers, DBCommission, DBPayment, DBUser } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function AdminCommissionsPage() {
    const [commissions, setCommissions] = useState<DBCommission[]>([]);
    const [payments, setPayments] = useState<DBPayment[]>([]);
    const [users, setUsers] = useState<DBUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [commissionsData, paymentsData, usersData] = await Promise.all([
                    fetchAdminCommissions(),
                    fetchAdminPayments(),
                    fetchAdminUsers(),
                ]);
                setCommissions(commissionsData);
                setPayments(paymentsData);
                setUsers(usersData);
            } catch (err) {
                console.error("Gagal memuat data komisi:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const totalCommissions = commissions.reduce((acc, c) => acc + c.amount, 0);
    const paidCommissions = payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);
    const pendingCommissions = payments.filter((p) => p.status === "pending").reduce((acc, p) => acc + p.amount, 0);

    const getAffiliateName = (id: string) => users.find((u) => u.id === id)?.name ?? "Unknown";

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
                <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memuat data komisi...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Komisi</h2>
                <p className="text-slate-500 mt-1">Komisi yang dihasilkan dari semua penjualan afiliasi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-slate-600">Total Komisi</h3>
                    <p className="text-3xl font-bold text-slate-900">{formatIDR(totalCommissions)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-green-600">Telah Dibayar</h3>
                    <p className="text-3xl font-bold text-slate-900">{formatIDR(paidCommissions)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-amber-600">Tertunda</h3>
                    <p className="text-3xl font-bold text-slate-900">{formatIDR(pendingCommissions)}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Tanggal</TableHead>
                            <TableHead className="font-semibold text-slate-900">ID Komisi</TableHead>
                            <TableHead className="font-semibold text-slate-900">ID Penjualan</TableHead>
                            <TableHead className="font-semibold text-slate-900">Afiliasi</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Jumlah</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada komisi yang dihasilkan.</TableCell>
                            </TableRow>
                        ) : (
                            commissions.map((comm) => (
                                <TableRow key={comm.id}>
                                    <TableCell>{new Date(comm.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-slate-500 text-xs">{comm.id}</TableCell>
                                    <TableCell className="font-mono text-slate-500 text-xs">{comm.sale_id}</TableCell>
                                    <TableCell className="font-medium">{getAffiliateName(comm.affiliate_id)}</TableCell>
                                    <TableCell className="text-right font-bold text-green-600">{formatIDR(comm.amount)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
