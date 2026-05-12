"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Infinity, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        whatsapp: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi.";
        if (!formData.email) {
            newErrors.email = "Email wajib diisi.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format email tidak valid.";
        }
        if (!formData.whatsapp) newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
        if (!formData.password) {
            newErrors.password = "Password wajib diisi.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password minimal 8 karakter.";
        }
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Konfirmasi password wajib sama dengan password.";
        }
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "Anda harus menyetujui syarat dan ketentuan.";
        }
        return newErrors;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/v1";
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                    password: formData.password,
                }),
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setErrors({ server: result.message || "Gagal melakukan registrasi." });
            }
        } catch (err) {
            setErrors({ server: "Gagal terhubung ke server. Pastikan backend sudah menyala." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user types
        if (errors[id]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm hover:scale-105 transition-transform">
                        <Infinity className="w-7 h-7" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 text-center">Daftar Akun Affiliator</h1>
                    <p className="text-slate-500 text-sm mt-1 text-center font-medium">Bergabunglah dengan program afiliasi kami</p>
                </div>

                {showSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Registrasi Berhasil!</h2>
                        <p className="text-slate-600 leading-relaxed px-4">
                            Akun Anda telah berhasil dibuat dan disimpan ke database. Silakan masuk untuk mulai mengelola afiliasi Anda.
                        </p>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-4">
                            <div className="bg-green-500 h-full w-full"></div>
                        </div>
                        <p className="text-sm text-slate-400 italic">Mengarahkan Anda ke halaman login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
                            <Input
                                id="fullName"
                                placeholder="Masukkan nama lengkap Anda"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all ${errors.fullName ? "border-red-500 ring-4 ring-red-500/10" : ""}`}
                            />
                            {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.fullName}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@contoh.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all ${errors.email ? "border-red-500 ring-4 ring-red-500/10" : ""}`}
                            />
                            {errors.email && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-sm font-semibold text-slate-700">Nomor WhatsApp</Label>
                            <Input
                                id="whatsapp"
                                placeholder="081234567890"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className={`h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all ${errors.whatsapp ? "border-red-500 ring-4 ring-red-500/10" : ""}`}
                            />
                            {errors.whatsapp && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.whatsapp}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Kata Sandi</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className={`h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all ${errors.password ? "border-red-500 ring-4 ring-red-500/10" : ""}`}
                            />
                            {errors.password && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Konfirmasi Kata Sandi</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all ${errors.confirmPassword ? "border-red-500 ring-4 ring-red-500/10" : ""}`}
                            />
                            {errors.confirmPassword && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <div className="flex items-center h-5 mt-0.5">
                                <input
                                    id="agreeTerms"
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500 transition-colors cursor-pointer accent-red-600"
                                />
                            </div>
                            <div className="text-sm leading-tight">
                                <label htmlFor="agreeTerms" className="text-slate-600 cursor-pointer font-medium selection:bg-red-100">
                                    Saya menyetujui <span className="text-red-600 hover:underline">syarat dan ketentuan</span> yang berlaku.
                                </label>
                                {errors.agreeTerms && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.agreeTerms}</p>}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-sm font-bold mt-4 shadow-md shadow-red-200 active:scale-[0.98] transition-all rounded-xl"
                        >
                            {isLoading ? "Sedang mendaftar..." : "Daftar sebagai Affiliator"}
                        </Button>

                        <div className="pt-8 text-center flex flex-col items-center gap-2">
                            <p className="text-sm text-slate-500 font-medium">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-red-600 font-bold hover:text-red-700 underline underline-offset-4 decoration-2 decoration-red-200 hover:decoration-red-600 transition-all">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
