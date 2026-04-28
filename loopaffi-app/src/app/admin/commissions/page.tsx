"use client";

import { useAppStore, mockUsers } from "@/lib/store";
import { formatIDR } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AdminCommissionsPage() {
    const { commissions, payments } = useAppStore();

    const totalCommissions = commissions.reduce((acc, c) => acc + c.amount, 0);
    const paidCommissions = payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);
    const pendingCommissions = payments.filter((p) => p.status === "pending").reduce((acc, p) => acc + p.amount, 0);

    const getAffiliateName = (id: string) => mockUsers.find((u) => u.id === id)?.name ?? "Unknown";

    // To find status of a commission we match it with the payment created for the same sale/affiliate
    const getCommissionStatus = (saleId: string) => {
        // In our mock logic, the payment date equals the sale date. For simplicity, we can just say if there's a pending payment for this affiliate, it's pending.
        // Better way: we assume commission is paid if there's no pending payment for this sale. (but our mock doesn't link payment and sale directly yet, only date/amount).
        return "completed";
    };

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
                                    <TableCell className="font-mono text-slate-500 text-xs">{comm.saleId}</TableCell>
                                    <TableCell className="font-medium">{getAffiliateName(comm.affiliateId)}</TableCell>
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
