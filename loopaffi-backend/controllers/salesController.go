package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Struct khusus (DTO) untuk menangkap data JSON yang dikirim Frontend/Postman
type SaleInput struct {
	ID           string          `json:"id_sale"`
	UserID       string          `json:"id_user"`
	TglPenjualan time.Time       `json:"tgl_penjualan"`
	StatusSale   string          `json:"status_sale"`
	Items        []SaleItemInput `json:"items"` // Array untuk menampung banyak barang
}

type SaleItemInput struct {
	ID          string  `json:"id_sale_item"`
	ProductID   string  `json:"id_product"`
	Qty         int     `json:"qty"`
	HargaSatuan float64 `json:"harga_satuan"`
}

// Fungsi kelolaPenjualan() sesuai DPPL
func CreateSale(c *gin.Context) {
	var input SaleInput

	// 1. Tangkap data JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Buat objek Sale sesuai Model Entity kita
	sale := models.Sale{
		ID:           input.ID,
		UserID:       input.UserID,
		TglPenjualan: input.TglPenjualan,
		StatusSale:   input.StatusSale,
	}

	// 3. Siapkan keranjang untuk menampung SaleItems
	var saleItems []models.SaleItem

	// 4. Hitung Subtotal secara dinamis untuk setiap item yang dibeli
	for _, itemInput := range input.Items {
		// Logika perhitungan: Subtotal = Qty * HargaSatuan
		kalkulasiSubtotal := float64(itemInput.Qty) * itemInput.HargaSatuan

		item := models.SaleItem{
			ID:          itemInput.ID,
			SaleID:      sale.ID, // Sambungkan Foreign Key ke ID Penjualan
			ProductID:   itemInput.ProductID,
			Qty:         itemInput.Qty,
			HargaSatuan: itemInput.HargaSatuan,
			Subtotal:    kalkulasiSubtotal, // Hasil kalkulasi dimasukkan ke sini
		}
		saleItems = append(saleItems, item)
	}

	// Gabungkan items ke dalam objek Sale
	sale.SaleItems = saleItems

	// 5. Simpan Data Penjualan (Otomatis menyimpan ke tabel sales dan sale_items)
	if err := config.DB.Create(&sale).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data penjualan!"})
		return
	}

	// 6. Kembalikan Response Sukses
	c.JSON(http.StatusOK, gin.H{
		"message": "Data penjualan berhasil diinput!",
		"data":    sale,
	})
}