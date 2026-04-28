"use client";

import { useAppStore, mockUsers, User } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { formatIDR } from "@/lib/utils";

interface AffiliateReport {
    affiliate: User;
    totalSales: number;
    salesCount: number;
    totalCommission: number;
    paidCommission: number;
    pendingCommission: number;
}

export default function AdminReportsPage() {
    const { sales, commissions, payments } = useAppStore();
    const affiliates = mockUsers.filter((u) => u.role === "affiliate");

    const reportData: AffiliateReport[] = affiliates.map((affiliate) => {
        const affiliateSales = sales.filter((s) => s.affiliateId === affiliate.id);
        const affiliateCommissions = commissions.filter((c) => c.affiliateId === affiliate.id);
        const affiliatePayments = payments.filter((p) => p.affiliateId === affiliate.id);

        return {
            affiliate,
            totalSales: affiliateSales.reduce((acc, s) => acc + s.amount, 0),
            salesCount: affiliateSales.length,
            totalCommission: affiliateCommissions.reduce((acc, c) => acc + c.amount, 0),
            paidCommission: affiliatePayments
                .filter((p) => p.status === "paid")
                .reduce((acc, p) => acc + p.amount, 0),
            pendingCommission: affiliatePayments
                .filter((p) => p.status === "pending")
                .reduce((acc, p) => acc + p.amount, 0),
        };
    });

    const handleExportCSV = () => {
        const headers = [
            "Affiliate Name",
            "Email",
            "Total Penjualan (IDR)",
            "Sales Count",
            "Total Komisi (IDR)",
            "Komisi Dibayar (IDR)",
            "Komisi Tertunda (IDR)",
        ];

        const rows = reportData.map((row) => [
            row.affiliate.name,
            row.affiliate.email,
            row.totalSales.toFixed(2),
            row.salesCount,
            row.totalCommission.toFixed(2),
            row.paidCommission.toFixed(2),
            row.pendingCommission.toFixed(2),
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `loopaffi-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Laporan</h2>
                    <p className="text-slate-500 mt-1">Ringkasan performa afiliasi. Ekspor ke CSV untuk perangkat eksternal.</p>
                </div>
                <Button onClick={handleExportCSV} className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    <Download className="w-4 h-4" /> Ekspor CSV
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Afiliasi</TableHead>
                            <TableHead className="font-semibold text-slate-900">Jumlah Penjualan</TableHead>
                            <TableHead className="font-semibold text-slate-900">Total Penjualan</TableHead>
                            <TableHead className="font-semibold text-slate-900">Total Komisi</TableHead>
                            <TableHead className="font-semibold text-slate-900">Telah Dibayar</TableHead>
                            <TableHead className="font-semibold text-slate-900">Tertunda</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data.</TableCell>
                            </TableRow>
                        ) : (
                            reportData.map((row) => (
                                <TableRow key={row.affiliate.id}>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{row.affiliate.name}</div>
                                        <div className="text-xs text-slate-500">{row.affiliate.email}</div>
                                    </TableCell>
                                    <TableCell>{row.salesCount}</TableCell>
                                    <TableCell>{formatIDR(row.totalSales)}</TableCell>
                                    <TableCell className="font-bold text-slate-900">{formatIDR(row.totalCommission)}</TableCell>
                                    <TableCell className="font-medium text-green-600">{formatIDR(row.paidCommission)}</TableCell>
                                    <TableCell className="font-medium text-amber-600">{formatIDR(row.pendingCommission)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
