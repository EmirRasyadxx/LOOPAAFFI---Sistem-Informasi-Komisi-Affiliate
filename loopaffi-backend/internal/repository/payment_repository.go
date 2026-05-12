package repository

import (
	"fmt"

	"github.com/emirrasyad/loopaffi-backend/internal/entity"
	"github.com/jmoiron/sqlx"
)

type PaymentRepository struct {
	db *sqlx.DB
}

func NewPaymentRepository(db *sqlx.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(p *entity.Payment) error {
	query := `INSERT INTO payments (id, affiliate_id, amount, date, status) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, p.ID, p.AffiliateID, p.Amount, p.Date, p.Status)
	if err != nil {
		return fmt.Errorf("failed to create payment: %w", err)
	}
	return nil
}

func (r *PaymentRepository) FindAll() ([]entity.Payment, error) {
	var payments []entity.Payment
	err := r.db.Select(&payments, "SELECT id, affiliate_id, amount, date, status FROM payments ORDER BY date DESC")
	if err != nil {
		return nil, fmt.Errorf("failed to fetch payments: %w", err)
	}
	return payments, nil
}

func (r *PaymentRepository) FindByAffiliateID(affiliateID string) ([]entity.Payment, error) {
	var payments []entity.Payment
	err := r.db.Select(&payments, "SELECT id, affiliate_id, amount, date, status FROM payments WHERE affiliate_id = $1 ORDER BY date DESC", affiliateID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch payments by affiliate: %w", err)
	}
	return payments, nil
}

func (r *PaymentRepository) MarkAsPaid(id string) error {
	result, err := r.db.Exec("UPDATE payments SET status = 'paid' WHERE id = $1 AND status = 'pending'", id)
	if err != nil {
		return fmt.Errorf("failed to mark payment as paid: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("payment not found or already paid")
	}
	return nil
}
