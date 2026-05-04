"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { apiLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Infinity, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Panggil API backend untuk login
            const data = await apiLogin(email, password);

            // data berisi: { message, token, user: { id, name, email, role } }
            login(data.user, data.token);

            // Redirect berdasarkan role
            router.push(`/${data.user.role}/dashboard`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
                    <h1 className="text-2xl font-bold text-slate-900">Selamat Datang di LoopAffi</h1>
                    <p className="text-slate-500 text-sm mt-1">Masuk untuk mengelola afiliasi Anda</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@loopaffi.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">Kata Sandi</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold shadow-lg shadow-red-500/25 transition-all duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sedang masuk...
                            </span>
                        ) : "Masuk"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                        >
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4 text-center justify-center">
                    <button
                        onClick={() => { setEmail("admin@loopaffi.com"); setPassword("password"); }}
                        className="text-xs text-slate-500 hover:text-red-600 underline underline-offset-4 transition-colors"
                    >
                        Gunakan Admin
                    </button>
                    <button
                        onClick={() => { setEmail("john@example.com"); setPassword("password"); }}
                        className="text-xs text-slate-500 hover:text-red-600 underline underline-offset-4 transition-colors"
                    >
                        Gunakan Afiliasi
                    </button>
                </div>
            </div>
        </div>
    );
}
