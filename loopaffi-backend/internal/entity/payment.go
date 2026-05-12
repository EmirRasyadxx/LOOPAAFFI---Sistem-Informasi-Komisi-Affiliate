package entity

type Payment struct {
	ID          string  `json:"id" db:"id"`
	AffiliateID string  `json:"affiliate_id" db:"affiliate_id"`
	Amount      float64 `json:"amount" db:"amount"`
	Date        string  `json:"date" db:"date"`
	Status      string  `json:"status" db:"status"`
}
