"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, mockUsers } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Infinity } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        setTimeout(() => {
            const user = mockUsers.find((u) => u.email === email);
            if (user && password === "password") {
                login(user);
                router.push(`/${user.role}/dashboard`);
            } else {
                setError("Kredensial tidak valid. Coba admin@loopaffi.com atau john@example.com dengan kata sandi 'password'.");
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                        <Infinity className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Selamat Datang di LoopAffi</h1>
                    <p className="text-slate-500 text-sm mt-1">Masuk untuk mengelola afiliasi Anda</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
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
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                    >
                        {isLoading ? "Sedang masuk..." : "Masuk"}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4 text-center justify-center">
                    <button
                        onClick={() => { setEmail("admin@loopaffi.com"); setPassword("password"); }}
                        className="text-xs text-slate-500 hover:text-red-600 underline underline-offset-4"
                    >
                        Gunakan Admin
                    </button>
                    <button
                        onClick={() => { setEmail("john@example.com"); setPassword("password"); }}
                        className="text-xs text-slate-500 hover:text-red-600 underline underline-offset-4"
                    >
                        Gunakan Afiliasi
                    </button>
                </div>
            </div>
        </div>
    );
}
