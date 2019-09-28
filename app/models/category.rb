class Category < ApplicationRecord
  validates_presence_of :name, :color
end
