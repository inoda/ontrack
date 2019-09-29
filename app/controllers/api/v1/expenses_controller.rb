module Api; module V1
  class ExpensesController < BaseController
    def index
      expenses = ::Expense.all
      expenses = expenses.where('paid_at >= ?', Time.at(params[:paid_after].to_i).to_datetime) if params[:paid_after]
      render json: expenses
    end
  end
end; end
