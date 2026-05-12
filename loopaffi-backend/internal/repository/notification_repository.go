package repository

import (
	"fmt"

	"github.com/emirrasyad/loopaffi-backend/internal/entity"
	"github.com/jmoiron/sqlx"
)

type NotificationRepository struct {
	db *sqlx.DB
}

func NewNotificationRepository(db *sqlx.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) FindByUserID(userID string) ([]entity.Notification, error) {
	var notifications []entity.Notification
	query := `SELECT id, user_id, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`
	err := r.db.Select(&notifications, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch notifications: %w", err)
	}
	return notifications, nil
}

func (r *NotificationRepository) MarkAsRead(id int, userID string) error {
	_, err := r.db.Exec("UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2", id, userID)
	return err
}

func (r *NotificationRepository) Create(n *entity.Notification) error {
	query := `INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING id, created_at`
	return r.db.QueryRow(query, n.UserID, n.Message).Scan(&n.ID, &n.CreatedAt)
}
