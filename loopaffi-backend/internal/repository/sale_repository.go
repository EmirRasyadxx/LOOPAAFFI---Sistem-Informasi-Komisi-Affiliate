package repository

import (
	"fmt"

	"github.com/emirrasyad/loopaffi-backend/internal/entity"
	"github.com/jmoiron/sqlx"
)

type SaleRepository struct {
	db *sqlx.DB
}

func NewSaleRepository(db *sqlx.DB) *SaleRepository {
	return &SaleRepository{db: db}
}

func (r *SaleRepository) Create(s *entity.Sale) error {
	query := `INSERT INTO sales (id, date, amount, affiliate_id, status) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, s.ID, s.Date, s.Amount, s.AffiliateID, s.Status)
	if err != nil {
		return fmt.Errorf("failed to create sale: %w", err)
	}
	return nil
}

func (r *SaleRepository) FindAll() ([]entity.Sale, error) {
	var sales []entity.Sale
	err := r.db.Select(&sales, "SELECT * FROM sales ORDER BY date DESC")
	return sales, err
}

func (r *SaleRepository) FindByAffiliateID(affiliateID string) ([]entity.Sale, error) {
	var sales []entity.Sale
	err := r.db.Select(&sales, "SELECT * FROM sales WHERE affiliate_id = $1 ORDER BY date DESC", affiliateID)
	return sales, err
}
