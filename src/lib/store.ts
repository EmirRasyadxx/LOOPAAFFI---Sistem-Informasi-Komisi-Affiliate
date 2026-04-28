import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'affiliate';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Sale {
    id: string;
    date: string;
    amount: number;
    affiliateId: string;
    status: 'completed' | 'refunded';
}

export interface Commission {
    id: string;
    saleId: string;
    affiliateId: string;
    amount: number;
    date: string;
}

export interface Payment {
    id: string;
    affiliateId: string;
    amount: number;
    date: string;
    status: 'pending' | 'paid';
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    read: boolean;
    date: string;
}

interface AppState {
    currentUser: User | null;
    users: User[];
    sales: Sale[];
    commissions: Commission[];
    payments: Payment[];
    notifications: Notification[];
    globalCommissionRate: number;
    darkMode: boolean;
    login: (user: User) => void;
    logout: () => void;
    addSale: (sale: Omit<Sale, 'id'>) => void;
    markPaymentPaid: (paymentId: string) => void;
    markNotificationRead: (id: string) => void;
    convertAllToIDR: () => void;
    toggleDarkMode: () => void;
}

export const mockUsers: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@loopaffi.com', role: 'admin' },
    { id: '2', name: 'John Affiliate', email: 'john@example.com', role: 'affiliate' },
    { id: '3', name: 'Jane Marketer', email: 'jane@example.com', role: 'affiliate' },
];

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentUser: null,
            users: mockUsers,
            sales: [],
            commissions: [],
            payments: [],
            notifications: [],
            globalCommissionRate: 0.1, // 10%
            darkMode: false,
            login: (user) => set({ currentUser: user }),
            logout: () => set({ currentUser: null }),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            convertAllToIDR: () => {
                set((state) => {
                    const rate = 16000;
                    // Auto conversion logic if not yet converted
                    // Heuristic: if any sale is < 100000, probably not IDR yet.
                    const needsConversion = state.sales.some(s => s.amount < 100000);
                    if (!needsConversion) return state;

                    return {
                        sales: state.sales.map(s => ({ ...s, amount: s.amount * rate })),
                        commissions: state.commissions.map(c => ({ ...c, amount: c.amount * rate })),
                        payments: state.payments.map(p => ({ ...p, amount: p.amount * rate }))
                    };
                });
            },
            addSale: (saleData) => {
                const id = Math.random().toString(36).substr(2, 9);
                const newSale: Sale = { ...saleData, id };

                const commissionAmount = saleData.amount * get().globalCommissionRate;
                const newCommission: Commission = {
                    id: Math.random().toString(36).substr(2, 9),
                    saleId: id,
                    affiliateId: saleData.affiliateId,
                    amount: commissionAmount,
                    date: saleData.date,
                };

                const newPayment: Payment = {
                    id: Math.random().toString(36).substr(2, 9),
                    affiliateId: saleData.affiliateId,
                    amount: commissionAmount,
                    date: saleData.date,
                    status: 'pending',
                };

                const newNotification: Notification = {
                    id: Math.random().toString(36).substr(2, 9),
                    userId: saleData.affiliateId,
                    message: `New sale recorded! You earned Rp ${(commissionAmount).toLocaleString('id-ID')}`,
                    read: false,
                    date: new Date().toISOString(),
                };

                set((state) => ({
                    sales: [newSale, ...state.sales],
                    commissions: [newCommission, ...state.commissions],
                    payments: [newPayment, ...state.payments],
                    notifications: [newNotification, ...state.notifications],
                }));
            },
            markPaymentPaid: (paymentId) => {
                set((state) => ({
                    payments: state.payments.map((p) =>
                        p.id === paymentId ? { ...p, status: 'paid' } : p
                    ),
                }));
            },
            markNotificationRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                }));
            },
        }),
        {
            name: 'loopaffi-storage',
        }
    )
);
