package entity

type Commission struct {
	ID          string  `json:"id" db:"id"`
	SaleID      string  `json:"sale_id" db:"sale_id"`
	AffiliateID string  `json:"affiliate_id" db:"affiliate_id"`
	Amount      float64 `json:"amount" db:"amount"`
	Date        string  `json:"date" db:"date"`
}
