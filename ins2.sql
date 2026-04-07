sale_items-- 1. Menyimpan data penjualan utama
INSERT INTO sales (id_sale, id_affiliate, input_by) 
VALUES ('S11', 'U06', 'U01');

-- 2. Menyimpan detail item yang terjual
INSERT INTO sale_items (id_sale_item, id_sale, id_product, qty, harga_satuan, subtotal) 
VALUES ('SI11', 'S11', 'P01', 2, 500000.00, 1000000.00);

-- Mengambil subtotal transaksi baru dan langsung menghitung 10% komisi untuk disimpan ke tabel commissions
INSERT INTO commissions (id_commission, id_sale, id_commission_setting, jumlah_komisi)
SELECT 
    'C11', 
    si.id_sale, 
    cs.id_commission_setting, 
    (si.subtotal * cs.persentase_komisi) AS jumlah_komisi
FROM sale_items si
CROSS JOIN commission_settings cs
WHERE si.id_sale = 'S11' AND cs.is_active = TRUE;

-- 1. Admin mengubah status komisi menjadi PAID
UPDATE commissions 
SET status_komisi = 'PAID' 
WHERE id_commission = 'C11';payments

-- 2. Sistem mencatat riwayat pembayaran
INSERT INTO payments (id_payment, id_commission, processed_by, tgl_pembayaran, jumlah_bayar, id_payment_method, status_bayar) 
VALUES ('PAY04', 'C11', 'U01', CURRENT_TIMESTAMP, 100000.00, 'PM01', 'COMPLETED');

-- 3. Sistem mengirimkan Notifikasi Lunas ke Affiliate
INSERT INTO notifications (id_notification, id_user, judul, pesannotifications) 
SELECT 
    'N04', 
    s.id_affiliate, 
    'Pembayaran Berhasil', 
    'Komisi dari transaksi S11 sebesar Rp100.000 telah ditransfer.'
FROM commissions c
JOIN sales s ON c.id_sale = s.id_sale
WHERE c.id_commission = 'C11';

-- Query Laporan Personal (Contoh: Dilihat oleh Rizky dengan id_user 'U03')
SELECT 
    s.tgl_penjualan, 
    s.id_sale, 
    si.subtotal AS total_penjualan, 
    c.jumlah_komisi, 
    c.status_komisi
FROM sales s
JOIN sale_items si ON s.id_sale = si.id_sale
JOIN commissions c ON s.id_sale = c.id_sale
WHERE s.id_affiliate = 'U03'
ORDER BY s.tgl_penjualan DESC;