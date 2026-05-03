package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Menangkap request dari Admin
type CommissionInput struct {
	ID     string `json:"id_commission"`
	SaleID string `json:"id_sale"` // ID Penjualan mana yang mau dihitung komisinya
}

// Fungsi prosesHitungKomisi()
func HitungKomisi(c *gin.Context) {
	var input CommissionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. hitungTotal() -> Tarik data Sale beserta isi SaleItems-nya
	var sale models.Sale
	if err := config.DB.Preload("SaleItems").First(&sale, "id_sale = ?", input.SaleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data penjualan tidak ditemukan!"})
		return
	}

	// Hitung total dari seluruh barang (SaleItems)
	var totalPenjualan float64 = 0
	for _, item := range sale.SaleItems {
		totalPenjualan += item.Subtotal
	}

	// 2. getPersentaseAktif() -> Tarik dari CommissionSetting yang is_active = true
	var setting models.CommissionSetting
	if err := config.DB.Where("is_active = ?", true).First(&setting).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tidak ada setting komisi yang aktif saat ini!"})
		return
	}

	// 3. hitungKomisi() -> Algoritma: amount = subtotal * (persentaseKomisi / 100)
	jumlahKomisi := totalPenjualan * (setting.PersentaseKomisi / 100)

	// 4. updateStatus("Pending") -> Buat objek komisi baru
	commission := models.Commission{
		ID:                  input.ID,
		SaleID:              sale.ID,
		CommissionSettingID: setting.ID,
		JumlahKomisi:        jumlahKomisi,
		TglHitung:           time.Now(),
		StatusKomisi:        "Pending", 
	}

	// Simpan nilai komisi ke database (D2: Tabel Komisi)
	if err := config.DB.Create(&commission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data komisi!"})
		return
	}

	// Berikan response sukses
	c.JSON(http.StatusOK, gin.H{
		"message": "Komisi berhasil dihitung dan berstatus Pending!",
		"data":    commission,
		"rincian_kalkulasi": gin.H{
			"total_penjualan": totalPenjualan,
			"persentase_aktif": setting.PersentaseKomisi,
		},
	})
}