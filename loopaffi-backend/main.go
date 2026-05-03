package main

import (
	"backend/config"
	"backend/models"
	"backend/routes"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Inisialisasi Koneksi Database PostgreSQL
	config.ConnectDatabase()

	// 2. Auto-Migrate Database (Genap 10 Tabel sesuai Class Diagram & ERD)
	// GORM akan otomatis membuat tabel jika belum ada atau memperbarui strukturnya
	err := config.DB.AutoMigrate(
		// Tabel Master / Referensi
		&models.Role{},
		&models.User{},
		&models.Product{},
		&models.PaymentMethod{},
		&models.CommissionSetting{},

		// Tabel Transaksional
		&models.Sale{},
		&models.SaleItem{},
		&models.Commission{},
		&models.Payment{},
		&models.Notification{},
	)

	if err != nil {
		fmt.Println("Gagal melakukan migrasi database:", err)
	} else {
		fmt.Println("Migrasi 10 tabel sistem LoopAffi berhasil dilakukan!")
	}

	// 3. Setup Framework Gin
	router := gin.Default()

	// 4. Daftarkan Routes API (Endpoint untuk Postman/Frontend)
	routes.SetupRoutes(router)

	// 5. Jalankan Server (Default di localhost:8080)
	fmt.Println("Server backend LoopAffi siap digunakan!")
	router.Run()
}
