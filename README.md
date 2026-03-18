# loopAffi - SISTEM INFORMASI KOMISI AFFILIATE

## Overview

**LoopAffi** adalah aplikasi berbasis web yang dirancang untuk mengotomatisasi pengelolaan komisi affiliate secara terpusat, efisien, dan transparan. Sistem ini dikembangkan untuk menggantikan proses manual yang rentan terhadap kesalahan dalam pencatatan penjualan, perhitungan komisi, serta pemantauan status pembayaran.

Melalui platform ini, admin dapat mengelola data penjualan, menghitung komisi secara otomatis, dan memantau proses pembayaran dalam satu sistem yang terintegrasi. Di sisi lain, affiliate dapat melihat performa penjualan dan jumlah komisi yang diperoleh secara real-time melalui dashboard yang informatif dan mudah digunakan.

Tujuan utama dari pengembangan sistem ini adalah meningkatkan efisiensi operasional, meminimalkan *human error*, serta memperkuat transparansi antara admin dan affiliate dalam proses pengelolaan komisi.

---

## Fitur Utama

- Manajemen data affiliate
- Input dan pencatatan data penjualan
- Perhitungan komisi otomatis
- Monitoring status pembayaran komisi
- Dashboard performa affiliate
- Rekap penjualan dan komisi secara terpusat
- Transparansi data antara admin dan affiliate

---

## 📊 Perancangan Sistem (DFD)

### DFD Level 0

<img src="asset/assets:dfd-level-0.png" alt="DFD Level 0" width="800">

*Diagram Konteks yang menunjukkan aliran data global.*

### DFD Level 1

<img src="asset/assets:dfd-level-1.png" alt="DFD Level 1" width="800">

---

## 🎨 Mockup Antarmuka

Rancangan UI aplikasi yang berfokus pada pengalaman pengguna. Mockup antarmuka **LoopAffi** dibagi ke dalam tiga bagian utama untuk menggambarkan alur penggunaan sistem, mulai dari proses autentikasi hingga fitur inti yang tersedia pada platform.

| Login Page | Dashboard | Core Feature |
| :---: | :---: | :---: |
| - | <img src="asset/LOOPAFFI/DASHBOARD%20ADMIN.png" width="300"><br>**Dashboard Admin** | <img src="asset/LOOPAFFI/SALES.png" width="300"><br>**Manajemen Sales (Admin)** |
| - | <img src="asset/LOOPAFFI/DASHBOARD%20-%20USER%20AFFILIATE.png" width="300"><br>**Dashboard User** | <img src="asset/LOOPAFFI/Sales%20User.png" width="300"><br>**Data Sales (User)** |
| - | - | <img src="asset/LOOPAFFI/COMISSION.png" width="300"><br>**Komisi** |
| - | - | <img src="asset/LOOPAFFI/payment.png" width="300"><br>**Pembayaran (Admin)** |
| - | - | <img src="asset/LOOPAFFI/Payments%20User.png" width="300"><br>**Pembayaran (User)** |
| - | - | <img src="asset/LOOPAFFI/ini%20report.png" width="300"><br>**Report / Laporan** |

*(Catatan: Bagian Login dikosongkan dengan tanda "-" karena berdasarkan daftar file di repository, file mockup login tidak tersedia)*

---

## Tech Stack

- Frontend : Reactjs
- Backend : GoLang
- Database : PostgreSQL

---

## Instalasi

```bash
# 1. Clone repository
git clone [https://github.com/username/loopAffi.git](https://github.com/username/loopAffi.git)

# 2. Install dependencies
npm install

# 3. Jalankan server
npm run dev
