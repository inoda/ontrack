require 'csv'

class ExportsController < ApplicationController
  def new
  end

  def create
    headers = ['paid_at', 'amount_in_cents', 'category', 'description']

    csv = CSV.generate(headers: true) do |csv|
      csv << headers
      Expense.includes(:category).find_in_batches do |batch|
        batch.each do |expense|
          csv << [expense.paid_at, expense.amount, expense.category.name, expense.description]
        end
      end
    end

    send_data csv, filename: "ontrack-export-#{Time.now}.csv"
  end
end
