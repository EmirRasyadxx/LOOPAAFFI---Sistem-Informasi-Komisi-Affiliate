package controllers

import (
	"backend/config"
	"backend/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// DTO untuk menangkap request dari Postman
type PaymentInput struct {
	ID              string `json:"id_payment"`
	CommissionID    string `json:"id_commission"`
	PaymentMethodID string `json:"id_payment_method"`
}

// Fungsi prosesPembayaran()
func ProsesPembayaran(c *gin.Context) {
	var input PaymentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Tarik data Komisi (Preload Sale supaya kita tahu ini komisi punya User/Affiliate siapa)
	var commission models.Commission
	if err := config.DB.Preload("Sale").First(&commission, "id_commission = ?", input.CommissionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data komisi tidak ditemukan!"})
		return
	}

	// Validasi kalau sudah lunas tidak bisa dibayar dua kali
	if commission.StatusKomisi == "Lunas" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Komisi ini sudah dibayar lunas!"})
		return
	}

	// 2. Dapatkan Metode Pembayaran (getMetode)
	var payMethod models.PaymentMethod
	if err := config.DB.First(&payMethod, "id_payment_method = ?", input.PaymentMethodID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Metode pembayaran tidak valid/tidak ditemukan!"})
		return
	}

	// === MULAI DATABASE TRANSACTION ===
	tx := config.DB.Begin()

	// 3. prosesPencairan() -> Kita catat ke tabel payments
	payment := models.Payment{
		ID:              input.ID,
		CommissionID:    commission.ID,
		PaymentMethodID: payMethod.ID,
		JumlahBayar:     commission.JumlahKomisi, // Angkanya ambil langsung dari komisi
		TglPembayaran:   time.Now(),
		StatusBayar:     "Berhasil", 
	}
	if err := tx.Create(&payment).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data pembayaran!"})
		return
	}

	// 4. updateStatus("Lunas") -> Perbarui status komisi
	commission.StatusKomisi = "Lunas"
	if err := tx.Save(&commission).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update status komisi!"})
		return
	}

	// 5. sendNotif() -> Generate Notifikasi untuk Affiliate
	notification := models.Notification{
		ID:     "NOTIF-" + time.Now().Format("20060102150405"), // Generate ID otomatis pakai format waktu
		UserID: commission.Sale.UserID,                         // Kirim ke Affiliate yang melakukan penjualan
		Judul:  "Pembayaran Komisi Berhasil Lunas",
		Pesan:  fmt.Sprintf("Komisi Anda sebesar %.2f telah dicairkan melalui %s.", commission.JumlahKomisi, payMethod.NamaMetode),
		IsRead: false,
	}
	if err := tx.Create(&notification).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat notifikasi!"})
		return
	}

	// === COMMIT TRANSACTION (Simpan permanen semua perubahannya) ===
	tx.Commit()

	// 6. generateBuktiBayar()
	// Untuk saat ini kita return sebagai string nama file. (Integrasi ke Library PDF asli biasanya dikerjakan paling akhir).
	fileBukti := fmt.Sprintf("bukti_bayar_%s.pdf", payment.ID)

	// Kembalikan Response
	c.JSON(http.StatusOK, gin.H{
		"message": "Pembayaran komisi berhasil diproses dan notifikasi telah dikirim!",
		"data_payment": payment,
		"bukti_bayar":  fileBukti,
		"notifikasi":   notification,
	})
}