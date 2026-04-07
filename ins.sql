-- Insert Roles
INSERT INTO roles (id_role, nama_role) VALUES 
('R01', 'Admin'), ('R02', 'Affiliate'), ('R03', 'Stakeholder');

-- Insert 10 Users (2 Admin, 8 Affiliate)
INSERT INTO users (id_user, id_role, nama_user, email, password_hash, no_hp) VALUES 
('U01', 'R01', 'Fadlan Admin', 'admin.fadlan@loopaffi.com', 'hashedpwd123', '081100001111'),
('U02', 'R01', 'Emir Admin', 'admin.emir@loopaffi.com', 'hashedpwd123', '081100002222'),
('U03', 'R02', 'Rizky Affiliate', 'rizky.aff@gmail.com', 'hashedpwd123', '081200003333'),
('U04', 'R02', 'Chandra Affiliate', 'chaca.aff@gmail.com', 'hashedpwd123', '081200004444'),
('U05', 'R02', 'Budi Santoso', 'budi.s@gmail.com', 'hashedpwd123', '081200005555'),
('U06', 'R02', 'Siti Aminah', 'siti.a@gmail.com', 'hashedpwd123', '081200006666'),
('U07', 'R02', 'Andi Wijaya', 'andi.w@gmail.com', 'hashedpwd123', '081200007777'),
('U08', 'R02', 'Rina Melati', 'rina.m@gmail.com', 'hashedpwd123', '081200008888'),
('U09', 'R02', 'Joko Anwar', 'joko.a@gmail.com', 'hashedpwd123', '081200009999'),
('U10', 'R02', 'Dewi Lestari', 'dewi.l@gmail.com', 'hashedpwd123', '081200000000');

-- Insert Affiliate Profiles (Hanya untuk user R02)
INSERT INTO affiliate_profiles (id_user, alamat, kode_affiliate) VALUES 
('U03', 'Bandung', 'AFF-RIZKY-01'), ('U04', 'Jakarta', 'AFF-CHACA-01'),
('U05', 'Surabaya', 'AFF-BUDI-01'), ('U06', 'Medan', 'AFF-SITI-01'),
('U07', 'Bali', 'AFF-ANDI-01'), ('U08', 'Makassar', 'AFF-RINA-01'),
('U09', 'Semarang', 'AFF-JOKO-01'), ('U10', 'Yogyakarta', 'AFF-DEWI-01');

-- Insert Products
INSERT INTO products (id_product, nama_product, sku, harga_default) VALUES 
('P01', 'Loop E-Course Basic', 'SKU-CRS-01', 500000.00),
('P02', 'Loop E-Course Pro', 'SKU-CRS-02', 1000000.00),
('P03', 'SaaS Subscription 1 Month', 'SKU-SAS-01', 150000.00),
('P04', 'SaaS Subscription 1 Year', 'SKU-SAS-12', 1500000.00),
('P05', 'Digital Marketing E-Book', 'SKU-EBK-01', 99000.00);

-- Insert Commission Settings (Admin mensetting komisi 10%)
INSERT INTO commission_settings (id_commission_setting, persentase_komisi, berlaku_mulai, created_by) VALUES 
('CS01', 0.10, '2026-01-01 00:00:00', 'U01');

-- Insert Payment Methods
INSERT INTO payment_methods (id_payment_method, nama_metode) VALUES 
('PM01', 'Bank BCA'), ('PM02', 'Bank Mandiri'), ('PM03', 'GoPay'), ('PM04', 'OVO');

-- Insert 10 Sales (P1.0: Kelola Data Penjualan)
INSERT INTO sales (id_sale, id_affiliate, input_by) VALUES 
('S01', 'U03', 'U01'), ('S02', 'U04', 'U01'), ('S03', 'U05', 'U02'),
('S04', 'U06', 'U02'), ('S05', 'U07', 'U01'), ('S06', 'U08', 'U01'),
('S07', 'U09', 'U02'), ('S08', 'U10', 'U02'), ('S09', 'U03', 'U01'),
('S10', 'U04', 'U02');

-- Insert Sale Items (Detail dari penjualan di atas)
INSERT INTO sale_items (id_sale_item, id_sale, id_product, qty, harga_satuan, subtotal) VALUES 
('SI01', 'S01', 'P01', 1, 500000.00, 500000.00),
('SI02', 'S02', 'P02', 1, 1000000.00, 1000000.00),
('SI03', 'S03', 'P03', 2, 150000.00, 300000.00),
('SI04', 'S04', 'P04', 1, 1500000.00, 1500000.00),
('SI05', 'S05', 'P05', 10, 99000.00, 990000.00),
('SI06', 'S06', 'P01', 1, 500000.00, 500000.00),
('SI07', 'S07', 'P02', 1, 1000000.00, 1000000.00),
('SI08', 'S08', 'P04', 1, 1500000.00, 1500000.00),
('SI09', 'S09', 'P05', 5, 99000.00, 495000.00),
('SI10', 'S10', 'P02', 2, 1000000.00, 2000000.00);

-- Insert 10 Commissions (P2.0: Hitung Komisi -> 10% dari Subtotal)
INSERT INTO commissions (id_commission, id_sale, id_commission_setting, jumlah_komisi, status_komisi) VALUES 
('C01', 'S01', 'CS01', 50000.00, 'PAID'),
('C02', 'S02', 'CS01', 100000.00, 'PAID'),
('C03', 'S03', 'CS01', 30000.00, 'PAID'),
('C04', 'S04', 'CS01', 150000.00, 'PENDING'),
('C05', 'S05', 'CS01', 99000.00, 'PENDING'),
('C06', 'S06', 'CS01', 50000.00, 'PENDING'),
('C07', 'S07', 'CS01', 100000.00, 'PENDING'),
('C08', 'S08', 'CS01', 150000.00, 'PENDING'),
('C09', 'S09', 'CS01', 49500.00, 'PENDING'),
('C10', 'S10', 'CS01', 200000.00, 'PENDING');

-- Insert Payments (Hanya untuk Komisi yang sudah PAID)
INSERT INTO payments (id_payment, id_commission, processed_by, tgl_pembayaran, jumlah_bayar, id_payment_method, status_bayar) VALUES 
('PAY01', 'C01', 'U01', CURRENT_TIMESTAMP, 50000.00, 'PM01', 'COMPLETED'),
('PAY02', 'C02', 'U01', CURRENT_TIMESTAMP, 100000.00, 'PM02', 'COMPLETED'),
('PAY03', 'C03', 'U02', CURRENT_TIMESTAMP, 30000.00, 'PM03', 'COMPLETED');

-- Insert Notifications
INSERT INTO notifications (id_notification, id_user, judul, pesan) VALUES 
('N01', 'U03', 'Komisi Cair!', 'Komisi Anda sebesar Rp50.000 telah dicairkan.'),
('N02', 'U04', 'Komisi Cair!', 'Komisi Anda sebesar Rp100.000 telah dicairkan.'),
('N03', 'U05', 'Komisi Cair!', 'Komisi Anda sebesar Rp30.000 telah dicairkan ke GoPay.');