package models

import "time"

// Model untuk tabel products
type Product struct {
	ID           string  `gorm:"primaryKey;type:varchar(50);column:id_product"`
	NamaProduct  string  `gorm:"type:varchar(100);column:nama_product"`
	SKU          string  `gorm:"type:varchar(50);column:sku"`
	HargaDefault float64 `gorm:"type:decimal(15,2);column:harga_default"`
	StatusProduct string `gorm:"type:varchar(50);column:status_product"`
}

// Model untuk tabel payment_methods
type PaymentMethod struct {
	ID         string `gorm:"primaryKey;type:varchar(50);column:id_payment_method"`
	NamaMetode string `gorm:"type:varchar(100);column:nama_metode"`
}

// Model untuk tabel commission_settings
type CommissionSetting struct {
	ID               string    `gorm:"primaryKey;type:varchar(50);column:id_commission_setting"`
	PersentaseKomisi float64   `gorm:"type:decimal(5,2);column:persentase_komisi"`
	BerlakuMulai     time.Time `gorm:"column:berlaku_mulai"`
	BerlakuSampai    time.Time `gorm:"column:berlaku_sampai"`
	IsActive         bool      `gorm:"column:is_active"`
	CreatedBy        string    `gorm:"type:varchar(50);column:created_by"`
}