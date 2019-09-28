class Category < ApplicationRecord
  validates_presence_of :name, :color

  has_many :expenses
end
