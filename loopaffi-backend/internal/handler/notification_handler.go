package handler

import (
	"net/http"
	"strconv"

	"github.com/emirrasyad/loopaffi-backend/internal/entity"
	"github.com/emirrasyad/loopaffi-backend/internal/middleware"
	"github.com/emirrasyad/loopaffi-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	notifRepo *repository.NotificationRepository
}

func NewNotificationHandler(notifRepo *repository.NotificationRepository) *NotificationHandler {
	return &NotificationHandler{notifRepo: notifRepo}
}

func (h *NotificationHandler) GetMyNotifications(c *gin.Context) {
	userID := c.GetString(middleware.UserIDKey)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Unauthorized"})
		return
	}

	notifications, err := h.notifRepo.FindByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal mengambil notifikasi"})
		return
	}

	// Pastikan selalu return array, bukan null
	if notifications == nil {
		notifications = []entity.Notification{}
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Notifikasi berhasil diambil",
		"data":    notifications,
	})
}

func (h *NotificationHandler) MarkRead(c *gin.Context) {
	userID := c.GetString(middleware.UserIDKey)
	notifIDStr := c.Param("id")
	notifID, _ := strconv.Atoi(notifIDStr)

	err := h.notifRepo.MarkAsRead(notifID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal memperbarui notifikasi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Notifikasi dibaca"})
}
