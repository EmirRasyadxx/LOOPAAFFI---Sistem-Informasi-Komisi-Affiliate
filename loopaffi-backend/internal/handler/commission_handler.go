package handler

import (
	"net/http"

	"github.com/emirrasyad/loopaffi-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type CommissionHandler struct {
	commissionRepo *repository.CommissionRepository
}

func NewCommissionHandler(commissionRepo *repository.CommissionRepository) *CommissionHandler {
	return &CommissionHandler{commissionRepo: commissionRepo}
}

func (h *CommissionHandler) GetAllCommissions(c *gin.Context) {
	commissions, err := h.commissionRepo.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data komisi",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   commissions,
	})
}
