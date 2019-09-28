class Expense < ApplicationRecord
  validates_presence_of :description, :amount, :category_id
end
