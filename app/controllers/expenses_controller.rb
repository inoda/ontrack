class ExpensesController < ApplicationController
  def index
    @has_data = Expense.count > 0
  end
end
