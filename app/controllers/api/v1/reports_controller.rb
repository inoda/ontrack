module Api; module V1
  class ReportsController < BaseController
    def year
      total = ActiveRecord::Base.connection.execute(%{
        select sum(expenses.amount) as amount
        from expenses
        where paid_at >= '#{params[:year].to_i}-01-01'
        and paid_at < '#{params[:year].to_i + 1}-01-01'
      }).first['amount']

      category_percentages = ActiveRecord::Base.connection.execute(%{
        select categories.name AS category, sum(expenses.amount) / #{total.to_f} AS percentage
        from expenses
        join categories on expenses.category_id = categories.id
        where paid_at >= '#{params[:year].to_i}-01-01'
        and paid_at < '#{params[:year].to_i + 1}-01-01'
        group by categories.id
        order by percentage;
      })

      category_totals = ActiveRecord::Base.connection.execute(%{
        select categories.name AS category, sum(expenses.amount) AS amount
        from expenses
        join categories on expenses.category_id = categories.id
        where paid_at >= '#{params[:year].to_i}-01-01'
        and paid_at < '#{params[:year].to_i + 1}-01-01'
        group by categories.id
        order by amount;
      })

      category_amounts_by_month = ActiveRecord::Base.connection.execute(%{
        select categories.name AS category, to_char(date_trunc('month', paid_at), 'Mon') AS month, sum(expenses.amount) AS amount
        from expenses
        join categories on expenses.category_id = categories.id
        where paid_at >= '#{params[:year].to_i}-01-01'
        and paid_at < '#{params[:year].to_i + 1}-01-01'
        group by month, categories.id;
      })

      render json: {
        category_percentages: category_percentages,
        category_totals: category_totals,
        category_amounts_by_month: category_amounts_by_month,
        total: total,
        categories: Category.all.select(:id, :name, :color).order(:name)
      }
    end

    def month
      start_date = Date.strptime(params[:month], '%B %Y')
      end_date = start_date + 1.month

      results = ActiveRecord::Base.connection.execute(%{
        select categories.name AS category, categories.monthly_goal as monthly_goal, sum(expenses.amount) AS spend
        from expenses
        join categories on expenses.category_id = categories.id
        where paid_at >= '#{start_date}'
        and paid_at < '#{end_date}'
        group by categories.name, categories.monthly_goal
        order by spend desc;
      })

      render json: { results: results, total: Expense.where("paid_at >= '#{start_date}' and paid_at < '#{end_date}'").sum(:amount), monthly_goal: User.first.monthly_goal }
    end
  end
end; end
