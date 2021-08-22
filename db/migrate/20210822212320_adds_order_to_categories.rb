class AddsOrderToCategories < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :rank, :integer, default: 0
  end
end
