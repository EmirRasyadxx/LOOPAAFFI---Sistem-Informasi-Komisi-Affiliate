"use client";

import { useAppStore, mockUsers } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AdminPaymentsPage() {
    const { payments, markPaymentPaid } = useAppStore();

    const getAffiliateName = (id: string) => mockUsers.find((u) => u.id === id)?.name ?? "Unknown";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pembayaran</h2>
                <p className="text-slate-500 mt-1">Kelola dan proses pembayaran komisi yang tertunda.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Tanggal</TableHead>
                            <TableHead className="font-semibold text-slate-900">ID Pembayaran</TableHead>
                            <TableHead className="font-semibold text-slate-900">Afiliasi</TableHead>
                            <TableHead className="font-semibold text-slate-900">Jumlah</TableHead>
                            <TableHead className="font-semibold text-slate-900">Status</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">Tidak ada riwayat pembayaran.</TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-slate-500 text-xs">{payment.id}</TableCell>
                                    <TableCell className="font-medium">{getAffiliateName(payment.affiliateId)}</TableCell>
                                    <TableCell className="font-bold text-slate-900">{formatIDR(payment.amount)}</TableCell>
                                    <TableCell>
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
                                    <TableCell className="text-right">
                                        {payment.status === "pending" && (
                                            <Button
                                                size="sm"
                                                className="bg-red-600 hover:bg-red-700 text-white h-8 text-xs"
                                                onClick={() => markPaymentPaid(payment.id)}
                                            >
                                                Tandai Lunas
                                            </Button>
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
