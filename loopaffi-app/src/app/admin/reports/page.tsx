"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Download, Loader2 } from "lucide-react";
import { formatIDR } from "@/lib/utils";
import { fetchAdminReport, DBReportRow } from "@/lib/api";

export default function AdminReportsPage() {
    const [reportData, setReportData] = useState<DBReportRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReport = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchAdminReport();
                setReportData(data);
            } catch (err: any) {
                console.error("Gagal memuat laporan:", err);
                setError(err.message || "Gagal memuat data laporan");
            } finally {
                setIsLoading(false);
            }
        };
        loadReport();
    }, []);

    const handleExportCSV = () => {
        const headers = [
            "Affiliate Name",
            "Email",
            "Total Penjualan (IDR)",
            "Jumlah Transaksi",
            "Total Komisi (IDR)",
            "Komisi Dibayar (IDR)",
            "Komisi Tertunda (IDR)",
        ];

        const rows = reportData.map((row) => [
            row.affiliate_name,
            row.affiliate_email,
            row.total_sales.toFixed(2),
            row.sales_count,
            row.total_commission.toFixed(2),
            row.paid_commission.toFixed(2),
            row.pending_commission.toFixed(2),
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
                <Button
                    onClick={handleExportCSV}
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    disabled={reportData.length === 0}
                >
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2 text-slate-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Memuat data laporan...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-red-500">{error}</TableCell>
                            </TableRow>
                        ) : reportData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data.</TableCell>
                            </TableRow>
                        ) : (
                            reportData.map((row) => (
                                <TableRow key={row.affiliate_id}>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{row.affiliate_name}</div>
                                        <div className="text-xs text-slate-500">{row.affiliate_email}</div>
                                    </TableCell>
                                    <TableCell>{row.sales_count}</TableCell>
                                    <TableCell>{formatIDR(row.total_sales)}</TableCell>
                                    <TableCell className="font-bold text-slate-900">{formatIDR(row.total_commission)}</TableCell>
                                    <TableCell className="font-medium text-green-600">{formatIDR(row.paid_commission)}</TableCell>
                                    <TableCell className="font-medium text-amber-600">{formatIDR(row.pending_commission)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
