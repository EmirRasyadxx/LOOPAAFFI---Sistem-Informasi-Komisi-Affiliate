package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Kita bikin grup URL biar rapi, diawali dengan /api
	api := r.Group("/api")
	{
		api.POST("/roles", controllers.CreateRole) // Endpoint bikin Role
		api.POST("/users", controllers.CreateUser) // Endpoint bikin User
		api.POST("/sales", controllers.CreateSale) // Endpoint bikin Penjualan
			// Endpoint untuk (Use Case #2)
		api.POST("/commissions/calculate", controllers.HitungKomisi)
			// Endpoint untuk  (Use Case #3)
		api.POST("/payments/process", controllers.ProsesPembayaran)
			// Endpoint untuk (Use Case #4)
			// Endpoint untuk Buat Laporan (Use Case #4)
		api.GET("/reports", controllers.BuatLaporan)
	}
}
