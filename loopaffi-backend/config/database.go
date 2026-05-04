package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Coba load .env (untuk lokal), abaikan error (untuk production)
	_ = godotenv.Load()

	// Prioritaskan DATABASE_URL (format Railway/Render)
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		// Fallback ke variabel terpisah (untuk lokal)
		host := os.Getenv("DB_HOST")
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")
		port := os.Getenv("DB_PORT")

		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
			host, user, password, dbname, port,
		)
	}

	// Buka koneksi pakai GORM
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi ke database!", err)
	}

	fmt.Println("Koneksi database PostgreSQL berhasil!")
	DB = database
}