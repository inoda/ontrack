module Api; module V1
  class ReportsController < BaseController
    def by_month_and_category
      results = ActiveRecord::Base.connection.execute(%{
        select categories.name AS category, to_char(date_trunc('month', paid_at), 'Mon') AS month, sum(expenses.amount)/100.0 AS amount
        from expenses
        join categories on expenses.category_id = categories.id
        where paid_at >= '#{params[:year].to_i}-01-01'
        and paid_at < '#{params[:year].to_i + 1}-01-01'
        group by month, categories.name;
      })

      render json: { results: results, categories: Category.all.select(:id, :name, :color).order(:name) }
    end
  end
end; end
