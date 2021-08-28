class AddIndices < ActiveRecord::Migration[6.1]
  def change
    add_index :categories, :rank
    add_index :expenses, :amount
    add_index :expenses, :category_id
    add_index :expenses, :paid_at
  end
end
