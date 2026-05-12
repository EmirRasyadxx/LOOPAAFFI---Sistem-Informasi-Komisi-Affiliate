package repository

import (
	"fmt"

	"github.com/emirrasyad/loopaffi-backend/internal/entity"
	"github.com/jmoiron/sqlx"
)

type CommissionRepository struct {
	db *sqlx.DB
}

func NewCommissionRepository(db *sqlx.DB) *CommissionRepository {
	return &CommissionRepository{db: db}
}

func (r *CommissionRepository) Create(c *entity.Commission) error {
	query := `INSERT INTO commissions (id, sale_id, affiliate_id, amount, date) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, c.ID, c.SaleID, c.AffiliateID, c.Amount, c.Date)
	if err != nil {
		return fmt.Errorf("failed to create commission: %w", err)
	}
	return nil
}

func (r *CommissionRepository) FindAll() ([]entity.Commission, error) {
	var commissions []entity.Commission
	err := r.db.Select(&commissions, "SELECT id, sale_id, affiliate_id, amount, date FROM commissions ORDER BY date DESC")
	if err != nil {
		return nil, fmt.Errorf("failed to fetch commissions: %w", err)
	}
	return commissions, nil
}

func (r *CommissionRepository) FindByAffiliateID(affiliateID string) ([]entity.Commission, error) {
	var commissions []entity.Commission
	err := r.db.Select(&commissions, "SELECT id, sale_id, affiliate_id, amount, date FROM commissions WHERE affiliate_id = $1 ORDER BY date DESC", affiliateID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch commissions by affiliate: %w", err)
	}
	return commissions, nil
}
