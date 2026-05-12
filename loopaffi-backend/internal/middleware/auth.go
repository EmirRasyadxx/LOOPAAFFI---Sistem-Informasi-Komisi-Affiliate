package middleware

import (
	"strings"

	"github.com/emirrasyad/loopaffi-backend/internal/response"
	"github.com/emirrasyad/loopaffi-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

const UserIDKey = "user_id"
const UserRoleKey = "user_role"
const UserEmailKey = "user_email"

// AuthMiddleware validates JWT token from Authorization: Bearer <token>
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Token tidak ditemukan. Harap login terlebih dahulu")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			response.Unauthorized(c, "Format token tidak valid. Gunakan: Bearer <token>")
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(parts[1], jwtSecret)
		if err != nil {
			response.Unauthorized(c, "Token tidak valid atau sudah kedaluwarsa: "+err.Error())
			c.Abort()
			return
		}

		// Store claims in context for downstream handlers
		c.Set(UserIDKey, claims.UserID)
		c.Set(UserRoleKey, claims.Role)
		c.Set(UserEmailKey, claims.Email)
		c.Next()
	}
}

// RoleMiddleware restricts access to specific roles
func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(UserRoleKey)
		if !exists {
			response.Unauthorized(c, "Role tidak ditemukan. Harap login terlebih dahulu")
			c.Abort()
			return
		}

		userRole := role.(string)
		for _, allowed := range allowedRoles {
			if userRole == allowed {
				c.Next()
				return
			}
		}

		response.Forbidden(c, "Akses ditolak. Role '"+userRole+"' tidak diizinkan mengakses endpoint ini")
		c.Abort()
	}
}
