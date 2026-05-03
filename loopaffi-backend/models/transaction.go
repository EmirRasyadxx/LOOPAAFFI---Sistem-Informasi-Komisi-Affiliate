package models

import "time"

// 1. Model untuk tabel sales (Penjualan)
type Sale struct {
	ID           string    `gorm:"primaryKey;type:varchar(50);column:id_sale"`
	UserID       string    `gorm:"type:varchar(50);column:id_user"` // Sesuai relasi "menginput / melakukan" dari User
	TglPenjualan time.Time `gorm:"column:tgl_penjualan"`
	StatusSale   string    `gorm:"type:varchar(50);column:status_sale"`

	// Relasi
	User      User       `gorm:"foreignKey:UserID;references:ID"`
	SaleItems []SaleItem `gorm:"foreignKey:SaleID;references:ID"` // 1 Sale punya banyak SaleItem
}

// 2. Model untuk tabel sale_items (Detail Penjualan)
type SaleItem struct {
	ID          string  `gorm:"primaryKey;type:varchar(50);column:id_sale_item"`
	SaleID      string  `gorm:"type:varchar(50);column:id_sale"`
	ProductID   string  `gorm:"type:varchar(50);column:id_product"` // Sesuai relasi "masuk ke" Product
	Qty         int     `gorm:"column:qty"`
	HargaSatuan float64 `gorm:"type:decimal(15,2);column:harga_satuan"`
	Subtotal    float64 `gorm:"type:decimal(15,2);column:subtotal"`

	// Relasi
	Sale    Sale    `gorm:"foreignKey:SaleID;references:ID"`
	Product Product `gorm:"foreignKey:ProductID;references:ID"`
}

// 3. Model untuk tabel commissions (Komisi)
type Commission struct {
	ID                  string    `gorm:"primaryKey;type:varchar(50);column:id_commission"`
	SaleID              string    `gorm:"type:varchar(50);column:id_sale"` // Relasi ke Sale
	CommissionSettingID string    `gorm:"type:varchar(50);column:id_commission_setting"` // Relasi "menjadi acuan"
	JumlahKomisi        float64   `gorm:"type:decimal(15,2);column:jumlah_komisi"`
	TglHitung           time.Time `gorm:"column:tgl_hitung"`
	StatusKomisi        string    `gorm:"type:varchar(50);column:status_komisi"`

	// Relasi
	Sale              Sale              `gorm:"foreignKey:SaleID;references:ID"`
	CommissionSetting CommissionSetting `gorm:"foreignKey:CommissionSettingID;references:ID"`
}

// 4. Model untuk tabel payments (Pembayaran)
type Payment struct {
	ID              string    `gorm:"primaryKey;type:varchar(50);column:id_payment"`
	CommissionID    string    `gorm:"type:varchar(50);column:id_commission"` // Relasi "dicairkan dalam"
	PaymentMethodID string    `gorm:"type:varchar(50);column:id_payment_method"` // Relasi "menggunakan"
	JumlahBayar     float64   `gorm:"type:decimal(15,2);column:jumlah_bayar"`
	TglPembayaran   time.Time `gorm:"column:tgl_pembayaran"`
	StatusBayar     string    `gorm:"type:varchar(50);column:status_bayar"`

	// Relasi
	Commission    Commission    `gorm:"foreignKey:CommissionID;references:ID"`
	PaymentMethod PaymentMethod `gorm:"foreignKey:PaymentMethodID;references:ID"`
}

// 5. Model untuk tabel notifications (Notifikasi)
type Notification struct {
	ID     string `gorm:"primaryKey;type:varchar(50);column:id_notification"`
	UserID string `gorm:"type:varchar(50);column:id_user"` // Relasi "menerima" ke User
	Judul  string `gorm:"type:varchar(100);column:judul"`
	Pesan  string `gorm:"type:text;column:pesan"`
	IsRead bool   `gorm:"default:false;column:is_read"`

	// Relasi
	User User `gorm:"foreignKey:UserID;references:ID"`
}