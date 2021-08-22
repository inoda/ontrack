class Category < ApplicationRecord
  validates_presence_of :name, :color

  has_many :expenses

  default_scope { order(rank: :asc, id: :asc) }
end
