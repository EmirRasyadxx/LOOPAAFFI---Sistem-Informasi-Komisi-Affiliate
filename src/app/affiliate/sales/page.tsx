"use client";

import { useAppStore } from "@/lib/store";
import { formatIDR } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AffiliateSalesPage() {
    const { currentUser, sales, globalCommissionRate } = useAppStore();

    if (!currentUser) return null;

    const mySales = sales.filter((s) => s.affiliateId === currentUser.id);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Penjualan Saya</h2>
                <p className="text-slate-500 mt-1">
                    Penjualan rujukan dan komisi yang Anda peroleh.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Tanggal</TableHead>
                            <TableHead className="font-semibold text-slate-900">ID Penjualan</TableHead>
                            <TableHead className="font-semibold text-slate-900">Jumlah Penjualan</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Komisi Diperoleh</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mySales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                    Belum ada transaksi penjualan di akun Anda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mySales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500">{sale.id}</TableCell>
                                    <TableCell>{formatIDR(sale.amount)}</TableCell>
                                    <TableCell className="text-green-600 font-bold text-right">
                                        {formatIDR(sale.amount * globalCommissionRate)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
