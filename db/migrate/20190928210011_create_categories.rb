class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories do |t|
      t.text :name, null: false
      t.string :color, null: false
      t.integer :annual_goal

      t.timestamps
    end
  end
end
