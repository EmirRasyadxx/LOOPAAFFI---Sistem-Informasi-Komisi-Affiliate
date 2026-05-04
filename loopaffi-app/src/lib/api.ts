const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ==================== Token Helper ====================
// Simpan & ambil JWT token dari localStorage
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('loopaffi_token');
}

export function setToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('loopaffi_token', token);
    }
}

export function removeToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('loopaffi_token');
    }
}

// ==================== Core Request ====================
// Otomatis menyisipkan Authorization header jika token tersedia
async function request(endpoint: string, options?: RequestInit) {
    const token = getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Sisipkan token ke header jika ada
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers,
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Network error' }));

        // Jika token kedaluwarsa / tidak valid, hapus token & redirect ke login
        if (res.status === 401) {
            removeToken();
            if (typeof window !== 'undefined') {
                // Hanya redirect jika bukan sedang di halaman login/register
                const path = window.location.pathname;
                if (path !== '/login' && path !== '/register') {
                    window.location.href = '/login';
                }
            }
        }

        throw new Error(err.error || 'Request failed');
    }
    return res.json();
}

// ==================== Auth ====================
export async function apiLogin(email: string, password: string) {
    const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    // Simpan token otomatis setelah login berhasil
    if (data.token) {
        setToken(data.token);
    }

    return data;
}

export async function apiRegister(payload: {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    roleId: string;
    phone?: string;
    status?: string;
}) {
    return request('/users', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function apiLogout() {
    removeToken();
}

// ==================== Sales ====================
export async function apiGetSales(affiliateId?: string) {
    const query = affiliateId ? `?affiliateId=${affiliateId}` : '';
    return request(`/sales${query}`);
}

export async function apiCreateSale(data: { date: string; amount: number; affiliateId: string; status: string }) {
    return request('/sales', { method: 'POST', body: JSON.stringify(data) });
}

// ==================== Commissions ====================
export async function apiGetCommissions(affiliateId?: string) {
    const query = affiliateId ? `?affiliateId=${affiliateId}` : '';
    return request(`/commissions${query}`);
}

// ==================== Payments ====================
export async function apiGetPayments(affiliateId?: string) {
    const query = affiliateId ? `?affiliateId=${affiliateId}` : '';
    return request(`/payments${query}`);
}

export async function apiMarkPaymentPaid(paymentId: string) {
    return request(`/payments/${paymentId}/pay`, { method: 'PUT' });
}

// ==================== Notifications ====================
export async function apiGetNotifications(userId: string) {
    return request(`/notifications?userId=${userId}`);
}

export async function apiMarkNotifRead(notifId: string) {
    return request(`/notifications/${notifId}/read`, { method: 'PUT' });
}

// ==================== Dashboard ====================
export async function apiGetDashboardStats(affiliateId?: string) {
    const query = affiliateId ? `?affiliateId=${affiliateId}` : '';
    return request(`/dashboard/stats${query}`);
}

// ==================== Reports ====================
export async function apiGetReports() {
    return request('/reports');
}
