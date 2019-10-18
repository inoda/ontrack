require 'csv'

class ExpenseUploadsController < ApplicationController
  def new
    @categories = Category.all.order(:name)
  end

  def create
    default_category_id = params[:default_category_id].to_i
    amount_idx = params[:amount_col].to_i - 1
    paid_date_idx = params[:paid_date_col].to_i - 1
    description_idx = params[:description_col].to_i - 1
    category_idx = params[:category_col].to_i - 1
    file_contents = File.read(params[:file].tempfile)
    csv = CSV.parse(file_contents)

    searched_categories = {}
    csv.each do |row|
      amount = row[amount_idx].to_f.abs * 100
      next if amount == 0
      paid_at = Chronic.parse(row[paid_date_idx])
      description = row[description_idx]

      category_id = default_category_id
      if category_idx >= 0
        category = row[category_idx]
        if category.present?
          searched_categories[category] = Category.find_by("lower(name) = ?", category.downcase).try(:id) || default_category_id if searched_categories[category].nil?
          category_id = searched_categories[category]
        end
      end

      Expense.create!(amount: amount, paid_at: paid_at, description: description, category_id: category_id)
    end

    redirect_to expenses_path
  end
end
