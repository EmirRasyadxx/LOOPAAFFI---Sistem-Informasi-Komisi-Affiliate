package models

import "time"

// Model untuk tabel roles
type Role struct {
	ID       string `gorm:"primaryKey;type:varchar(50);column:id_role" json:"id"`
	NamaRole string `gorm:"type:varchar(50);column:nama_role" json:"name"`
}

// Model untuk tabel users
type User struct {
	ID           string    `gorm:"primaryKey;type:varchar(50);column:id_user" json:"id"`
	RoleID       string    `gorm:"type:varchar(50);column:id_role" json:"roleId"`
	NamaUser     string    `gorm:"type:varchar(100);column:nama_user" json:"name"`
	Email        string    `gorm:"type:varchar(100);unique;column:email" json:"email"`
	PasswordHash string    `gorm:"type:varchar(255);column:password_hash" json:"-"`
	NoHp         string    `gorm:"type:varchar(20);column:no_hp" json:"phone"`
	StatusUser   string    `gorm:"type:varchar(50);column:status_user" json:"status"`
	CreatedAt    time.Time `gorm:"autoCreateTime;column:created_at" json:"createdAt"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime;column:updated_at" json:"updatedAt"`

	// Relasi ke tabel Role (Belongs To)
	Role Role `gorm:"foreignKey:RoleID;references:ID" json:"role"`
}

// DTO untuk response login / user info yang sesuai dengan frontend
type UserResponse struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"` // "admin" atau "affiliate"
}

// Helper: convert User model ke UserResponse
func (u *User) ToResponse() UserResponse {
	roleName := "affiliate"
	if u.Role.NamaRole == "Admin" || u.Role.NamaRole == "admin" {
		roleName = "admin"
	}
	return UserResponse{
		ID:    u.ID,
		Name:  u.NamaUser,
		Email: u.Email,
		Role:  roleName,
	}
}