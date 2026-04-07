CREATE DATABASE affi;
-- 1. Tabel roles
CREATE TABLE roles (
    id_role VARCHAR(50) PRIMARY KEY,
    nama_role VARCHAR(100) NOT NULL
);

-- 2. Tabel users
CREATE TABLE users (
    id_user VARCHAR(50) PRIMARY KEY,
    id_role VARCHAR(50) REFERENCES roles(id_role),
    nama_user VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20),
    status_user VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel affiliate_profiles
CREATE TABLE affiliate_profiles (
    id_user VARCHAR(50) PRIMARY KEY REFERENCES users(id_user),
    alamat TEXT,
    tgl_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    kode_affiliate VARCHAR(50) UNIQUE NOT NULL,
    status_affiliate VARCHAR(50) DEFAULT 'APPROVED'
);

-- 4. Tabel stakeholder_profiles
CREATE TABLE stakeholder_profiles (
    id_user VARCHAR(50) PRIMARY KEY REFERENCES users(id_user),
    nama_instansi VARCHAR(255),
    jabatan VARCHAR(100),
    kategori_stakeholder VARCHAR(100),
    alamat TEXT,
    keterangan TEXT
);

-- 5. Tabel products
CREATE TABLE products (
    id_product VARCHAR(50) PRIMARY KEY,
    nama_product VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    harga_default DECIMAL(15,2) NOT NULL,
    status_product VARCHAR(50) DEFAULT 'AVAILABLE'
);

-- 6. Tabel commission_settings
CREATE TABLE commission_settings (
    id_commission_setting VARCHAR(50) PRIMARY KEY,
    persentase_komisi DECIMAL(5,2) NOT NULL, -- Contoh: 0.10 untuk 10%
    berlaku_mulai TIMESTAMP NOT NULL,
    berlaku_sampai TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(50) REFERENCES users(id_user)
);

-- 7. Tabel sales
CREATE TABLE sales (
    id_sale VARCHAR(50) PRIMARY KEY,
    id_affiliate VARCHAR(50) REFERENCES users(id_user),
    input_by VARCHAR(50) REFERENCES users(id_user),
    tgl_penjualan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_sale VARCHAR(50) DEFAULT 'VALID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel sale_items
CREATE TABLE sale_items (
    id_sale_item VARCHAR(50) PRIMARY KEY,
    id_sale VARCHAR(50) REFERENCES sales(id_sale),
    id_product VARCHAR(50) REFERENCES products(id_product),
    qty INT NOT NULL,
    harga_satuan DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL
);

-- 9. Tabel commissions
CREATE TABLE commissions (
    id_commission VARCHAR(50) PRIMARY KEY,
    id_sale VARCHAR(50) REFERENCES sales(id_sale),
    id_commission_setting VARCHAR(50) REFERENCES commission_settings(id_commission_setting),
    jumlah_komisi DECIMAL(15,2) NOT NULL,
    tgl_hitung TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_komisi VARCHAR(50) DEFAULT 'PENDING'
);

-- 10. Tabel payment_methods
CREATE TABLE payment_methods (
    id_payment_method VARCHAR(50) PRIMARY KEY,
    nama_metode VARCHAR(100) NOT NULL
);

-- 11. Tabel payments
CREATE TABLE payments (
    id_payment VARCHAR(50) PRIMARY KEY,
    id_commission VARCHAR(50) REFERENCES commissions(id_commission),
    processed_by VARCHAR(50) REFERENCES users(id_user),
    tgl_pembayaran TIMESTAMP,
    jumlah_bayar DECIMAL(15,2) NOT NULL,
    id_payment_method VARCHAR(50) REFERENCES payment_methods(id_payment_method),
    status_bayar VARCHAR(50) DEFAULT 'PENDING',
    bukti_bayar VARCHAR(255),
    catatan TEXT
);

-- 12. Tabel notifications
CREATE TABLE notifications (
    id_notification VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) REFERENCES users(id_user),
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);