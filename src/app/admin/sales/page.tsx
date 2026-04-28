"use client";

import { useState } from "react";
import { useAppStore, mockUsers } from "@/lib/store";
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
import { Plus } from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function AdminSalesPage() {
    const { sales, addSale, globalCommissionRate } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [amount, setAmount] = useState("");
    const [affiliateId, setAffiliateId] = useState(mockUsers.filter(u => u.role === "affiliate")[0]?.id || "");

    const affiliates = mockUsers.filter((u) => u.role === "affiliate");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;
        addSale({
            date: new Date().toISOString(),
            amount: Number(amount),
            affiliateId,
            status: "completed",
        });
        setAmount("");
        setIsAdding(false);
    };

    const getAffiliateName = (id: string) => mockUsers.find((u) => u.id === id)?.name ?? "Unknown";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Penjualan</h2>
                    <p className="text-slate-500 mt-1">Kelola dan catat transaksi penjualan manual.</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-red-600 hover:bg-red-700 text-white gap-2">
                        <Plus className="w-4 h-4" /> Tambah Penjualan
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Catat Penjualan Baru</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Jumlah Penjualan (IDR)</Label>
                            <Input
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
                            <Label>Afiliasi Terkait</Label>
                            <select
                                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={affiliateId}
                                onChange={(e) => setAffiliateId(e.target.value)}
                                required
                            >
                                {affiliates.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                                ))}
                            </select>
                        </div>
                        {amount && !isNaN(Number(amount)) && (
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                <span className="text-sm text-slate-600">Perkiraan Komisi (10%)</span>
                                <span className="text-lg font-bold text-green-600">{formatIDR((Number(amount) * globalCommissionRate))}</span>
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Simpan</Button>
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
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
                        {sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">Belum ada penjualan tercatat.</TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-slate-500 text-xs">{sale.id}</TableCell>
                                    <TableCell className="font-medium">{getAffiliateName(sale.affiliateId)}</TableCell>
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
