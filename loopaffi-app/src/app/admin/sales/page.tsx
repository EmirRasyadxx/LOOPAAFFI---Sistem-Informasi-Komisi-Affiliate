"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Loader2 } from "lucide-react";
import { formatIDR } from "@/lib/utils";
import { fetchAdminUsers, fetchAdminSales, createSale, DBUser, DBSale } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function AdminSalesPage() {
    const { globalCommissionRate } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [amount, setAmount] = useState("");
    const [affiliateId, setAffiliateId] = useState("");
    const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
    const [sales, setSales] = useState<DBSale[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingSales, setIsLoadingSales] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ambil data user dan sales asli dari backend
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingUsers(true);
            setIsLoadingSales(true);
            try {
                const [usersData, salesData] = await Promise.all([
                    fetchAdminUsers(),
                    fetchAdminSales(),
                ]);
                const affiliatesOnly = usersData.filter((u) => u.role === "affiliate");
                setDbUsers(affiliatesOnly);
                if (affiliatesOnly.length > 0 && !affiliateId) {
                    setAffiliateId(affiliatesOnly[0].id);
                }
                setSales(salesData);
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            } finally {
                setIsLoadingUsers(false);
                setIsLoadingSales(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || !affiliateId) return;
        
        setIsSubmitting(true);
        try {
            const newSale = await createSale(Number(amount), affiliateId);
            setSales((prev) => [newSale, ...prev]);
            setAmount("");
            setIsAdding(false);
        } catch (err: any) {
            console.error("Gagal mencatat penjualan:", err);
            alert(err.message || "Gagal mencatat penjualan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAffiliateName = (id: string) => {
        return dbUsers.find((u) => u.id === id)?.name ?? "Memuat...";
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Penjualan</h2>
                    <p className="text-slate-500 mt-1">Kelola dan catat transaksi penjualan manual.</p>
                </div>
                {!isAdding && (
                    <Button
                        id="btn-tambah-penjualan"
                        data-testid="btn-tambah-penjualan"
                        onClick={() => setIsAdding(true)}
                        className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    >
                        <Plus className="w-4 h-4" /> Tambah Penjualan
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Catat Penjualan Baru</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="input-nominal-penjualan">Jumlah Penjualan (IDR)</Label>
                            <Input
                                id="input-nominal-penjualan"
                                data-testid="input-nominal-penjualan"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="select-afiliasi">Afiliasi Terkait</Label>
                            <select
                                id="select-afiliasi"
                                data-testid="select-afiliasi"
                                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={affiliateId}
                                onChange={(e) => setAffiliateId(e.target.value)}
                                required
                            >
                                {isLoadingUsers ? (
                                    <option>Memuat data afiliasi...</option>
                                ) : dbUsers.length === 0 ? (
                                    <option>Tidak ada afiliasi terdaftar</option>
                                ) : (
                                    dbUsers.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                                    ))
                                )}
                            </select>
                        </div>
                        {amount && !isNaN(Number(amount)) && (
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                <span className="text-sm text-slate-600">Perkiraan Komisi (10%)</span>
                                <span className="text-lg font-bold text-green-600">{formatIDR((Number(amount) * globalCommissionRate))}</span>
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button
                                id="btn-simpan-penjualan"
                                data-testid="btn-simpan-penjualan"
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={dbUsers.length === 0 || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Menyimpan...</>
                                ) : (
                                    "Simpan"
                                )}
                            </Button>
                            <Button
                                id="btn-batal-penjualan"
                                data-testid="btn-batal-penjualan"
                                type="button"
                                variant="outline"
                                onClick={() => setIsAdding(false)}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Tanggal</TableHead>
                            <TableHead className="font-semibold text-slate-900">ID Penjualan</TableHead>
                            <TableHead className="font-semibold text-slate-900">Afiliasi</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Jumlah</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingSales ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2 text-slate-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Memuat data penjualan...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">Belum ada penjualan tercatat.</TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-slate-500 text-xs">{sale.id}</TableCell>
                                    <TableCell className="font-medium">{getAffiliateName(sale.affiliate_id)}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">{formatIDR(sale.amount)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
