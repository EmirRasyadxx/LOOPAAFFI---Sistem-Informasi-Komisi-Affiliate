"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRegister } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Infinity, Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<"admin" | "affiliate">("affiliate");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validasi sederhana
        if (password.length < 6) {
            setError("Kata sandi minimal 6 karakter.");
            setIsLoading(false);
            return;
        }

        try {
            // Generate ID unik untuk user baru
            const userId = `USR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

            // Tentukan roleId berdasarkan pilihan
            // Sesuai dengan seed.sql: ROLE-001 = Admin, ROLE-002 = Affiliate
            const roleId = role === "admin" ? "ROLE-001" : "ROLE-002";

            await apiRegister({
                id: userId,
                name: name,
                email: email,
                password_hash: password, // Backend akan menyimpan sebagai password_hash
                roleId: roleId,
                phone: "",
                status: "active",
            });

            setSuccess(true);

            // Redirect ke login setelah 2 detik
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Terjadi kesalahan saat registrasi.";
            setError(message);
            setIsLoading(false);
        }
    };

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-40" />
                </div>
                <div className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Registrasi Berhasil! 🎉</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengalihkan ke halaman login...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-40" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-40" />
            </div>

            <div className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/25">
                        <Infinity className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
                    <p className="text-slate-500 text-sm mt-1">Bergabung dengan LoopAffi sekarang</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-sm font-medium text-slate-700">Alamat Email</Label>
                        <Input
                            id="register-email"
                            type="email"
                            placeholder="email@contoh.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-sm font-medium text-slate-700">Kata Sandi</Label>
                        <div className="relative">
                            <Input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="h-11 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Pilih Role</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                    role === "admin"
                                        ? "border-red-500 bg-red-50 shadow-md shadow-red-100"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {role === "admin" && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 className="w-4 h-4 text-red-500" />
                                    </div>
                                )}
                                <div className={`text-lg mb-1 ${role === "admin" ? "grayscale-0" : "grayscale-0"}`}>🛡️</div>
                                <div className={`text-sm font-semibold ${role === "admin" ? "text-red-700" : "text-slate-700"}`}>
                                    Admin
                                </div>
                                <div className={`text-xs mt-0.5 ${role === "admin" ? "text-red-500" : "text-slate-400"}`}>
                                    Kelola seluruh sistem
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("affiliate")}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                    role === "affiliate"
                                        ? "border-red-500 bg-red-50 shadow-md shadow-red-100"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {role === "affiliate" && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 className="w-4 h-4 text-red-500" />
                                    </div>
                                )}
                                <div className="text-lg mb-1">💼</div>
                                <div className={`text-sm font-semibold ${role === "affiliate" ? "text-red-700" : "text-slate-700"}`}>
                                    Affiliate
                                </div>
                                <div className={`text-xs mt-0.5 ${role === "affiliate" ? "text-red-500" : "text-slate-400"}`}>
                                    Pantau komisi & penjualan
                                </div>
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold shadow-lg shadow-red-500/25 transition-all duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Mendaftarkan...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Daftar Sekarang
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Sudah punya akun?{" "}
                        <Link
                            href="/login"
                            className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                        >
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
