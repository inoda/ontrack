class CreatesTotalGoal < ActiveRecord::Migration[6.0]
  def change
    remove_column :categories, :annual_goal
    add_column :users, :monthly_goal, :integer, default: 0
  end
end
