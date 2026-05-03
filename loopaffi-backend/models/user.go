package models

import "time"

// Model untuk tabel roles
type Role struct {
	ID       string `gorm:"primaryKey;type:varchar(50);column:id_role"`
	NamaRole string `gorm:"type:varchar(50);column:nama_role"`
}

// Model untuk tabel users
type User struct {
	ID           string    `gorm:"primaryKey;type:varchar(50);column:id_user"`
	RoleID       string    `gorm:"type:varchar(50);column:id_role"` // Ini FK-nya
	NamaUser     string    `gorm:"type:varchar(100);column:nama_user"`
	Email        string    `gorm:"type:varchar(100);unique;column:email"`
	PasswordHash string    `gorm:"type:varchar(255);column:password_hash"`
	NoHp         string    `gorm:"type:varchar(20);column:no_hp"`
	StatusUser   string    `gorm:"type:varchar(50);column:status_user"`
	CreatedAt    time.Time `gorm:"autoCreateTime;column:created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime;column:updated_at"`

	// Relasi ke tabel Role (Belongs To)
	Role Role `gorm:"foreignKey:RoleID;references:ID"`
}