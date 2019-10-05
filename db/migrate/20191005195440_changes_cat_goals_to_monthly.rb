class ChangesCatGoalsToMonthly < ActiveRecord::Migration[6.0]
  def change
    add_column :categories, :monthly_goal, :integer, default: 0
  end
end
