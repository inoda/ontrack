class InsightsController < ApplicationController
  def index
    earliest_paid_date = Expense.order(:paid_at).first.try(:paid_at).try(:year) || Time.now.year
    @available_years = (earliest_paid_date..Time.now.year).to_a
  end
end
