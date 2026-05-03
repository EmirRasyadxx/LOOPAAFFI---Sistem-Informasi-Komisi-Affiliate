package controllers

import (
	"backend/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Struct untuk menampung hasil query laporan
type LaporanResult struct {
	NamaAffiliate  string  `json:"nama_affiliate"`
	TotalTransaksi int     `json:"total_transaksi"`
	TotalPenjualan float64 `json:"total_penjualan"`
	TotalKomisi    float64 `json:"total_komisi"`
}

// Fungsi buatLaporan() sesuai DPPL
func BuatLaporan(c *gin.Context) {
	var hasilLaporan []LaporanResult

	// Menggunakan Raw Query agar persis sesuai dengan perancangan Query #1 di dokumen DPPL
	query := `
		SELECT 
			u.nama_user as nama_affiliate, 
			COUNT(DISTINCT s.id_sale) as total_transaksi, 
			COALESCE(SUM(si.subtotal), 0) as total_penjualan, 
			COALESCE(SUM(c.jumlah_komisi), 0) as total_komisi
		FROM users u
		LEFT JOIN sales s ON u.id_user = s.id_user
		LEFT JOIN sale_items si ON s.id_sale = si.id_sale
		LEFT JOIN commissions c ON s.id_sale = c.id_sale
		GROUP BY u.id_user, u.nama_user
	`

	// Eksekusi query ke database
	if err := config.DB.Raw(query).Scan(&hasilLaporan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menarik data laporan!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Laporan performa Affiliate berhasil ditarik!",
		"data":    hasilLaporan,
	})
}