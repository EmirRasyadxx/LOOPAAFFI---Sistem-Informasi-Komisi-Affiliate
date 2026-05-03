package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Fungsi untuk bikin Role baru
func CreateRole(c *gin.Context) {
	var role models.Role
	
	// Tangkap data JSON dari request Postman/Frontend
	if err := c.ShouldBindJSON(&role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simpan ke database
	config.DB.Create(&role)
	c.JSON(http.StatusOK, gin.H{"message": "Role berhasil dibuat!", "data": role})
}

// Fungsi untuk bikin User (Register)
func CreateUser(c *gin.Context) {
	var user models.User
	
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simpan ke database
	config.DB.Create(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User berhasil dibuat!", "data": user})
}