package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Ambil token dari header Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Akses ditolak! Token tidak ditemukan."})
			c.Abort()
			return
		}

		// Hilangkan tulisan "Bearer " dari token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Ambil Secret Key (Gunakan .env di tahap production)
		secretKey := os.Getenv("JWT_SECRET")
		if secretKey == "" {
			secretKey = "loopaffi_rahasia_super_aman"
		}

		// Parse dan validasi token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Akses ditolak! Token tidak valid atau kedaluwarsa."})
			c.Abort()
			return
		}

		// Simpan claims ke context agar bisa diakses di controller
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("id_user", claims["id_user"])
		}

		// Lanjut ke Controller jika token valid
		c.Next()
	}
}
