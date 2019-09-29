class Expense < ApplicationRecord
  validates_presence_of :description, :amount, :category_id, :paid_at

  belongs_to :category
end
