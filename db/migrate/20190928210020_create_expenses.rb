class CreateExpenses < ActiveRecord::Migration[6.0]
  def change
    create_table :expenses do |t|
      t.text :description, null: false
      t.integer :amount, null: false
      t.integer :category_id, null: false
      t.timestamp :paid_at, null: false

      t.timestamps
    end
  end
end
