class InsightsController < ApplicationController
  def index
    earliest_paid_date = Expense.order(:paid_at).first.try(:paid_at) || DateTime.now
    @available_years = (earliest_paid_date.year..DateTime.now.year).to_a.reverse
    @available_months = (earliest_paid_date.to_datetime..DateTime.now).map { |m| m.strftime('%Y%m') }.uniq.map { |m| "#{Date::MONTHNAMES[Date.strptime(m, '%Y%m').month]} #{Date.strptime(m, '%Y%m').year}" }
    @has_data = Expense.count > 0
  end
end
