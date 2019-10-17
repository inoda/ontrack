class ExpensesController < ApplicationController
  def index
    @has_data = Expense.count > 0
    @categories = Category.all.order(:name).to_json
  end
end
