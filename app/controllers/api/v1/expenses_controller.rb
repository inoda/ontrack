module Api; module V1
  class ExpensesController < BaseController
    def index
      expenses = ::Expense.all
      expenses = expenses.where('paid_at >= ?', Time.at(params[:paid_after].to_i).to_datetime) if params[:paid_after]
      expenses = expenses.order(created_at: :desc)
      expenses = expenses.paginate(params[:page], params[:per_page]) if params[:page]

      opts = {}
      opts = { include: :category } if params[:include_category]

      if params[:page]
        paginate(expenses, opts)
      else
        render json: expenses
      end
    end

    def create
      expense = ::Expense.new(description: params[:description], category_id: params[:category_id], amount: params[:amount], paid_at: params[:paid_at])
      successful = expense.save
      render json: expense, status: successful ? 200 : 500
    end
  end
end; end
