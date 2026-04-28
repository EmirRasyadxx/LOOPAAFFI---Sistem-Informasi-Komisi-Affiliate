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

export default function AffiliatePaymentsPage() {
    const { currentUser, payments } = useAppStore();

    if (!currentUser) return null;

    const myPayments = payments.filter((p) => p.affiliateId === currentUser.id);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pembayaran Saya</h2>
                <p className="text-slate-500 mt-1">
                    Lacak riwayat pembayaran komisi Anda dan pembayaran yang tertunda.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Tanggal</TableHead>
                            <TableHead className="font-semibold text-slate-900">ID Pembayaran</TableHead>
                            <TableHead className="font-semibold text-slate-900">Jumlah</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                    Belum ada pembayaran.
                                </TableCell>
                            </TableRow>
                        ) : (
                            myPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500">{payment.id}</TableCell>
                                    <TableCell className="font-bold text-slate-900">{formatIDR(payment.amount)}</TableCell>
                                    <TableCell className="text-right">
                                        {payment.status === "paid" ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                Lunas
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                Tertunda
                                            </span>
                                        )}
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
