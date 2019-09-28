module Api; module V1
  class ExpensesController < BaseController
    def index
      render json: ::Expense.all
    end
  end
end; end
