class ExpensesController < ApplicationController
  def index
    @has_data = Expense.count > 0
    @categories = Category.all.to_json
  end
end
