require 'csv'

class ExpenseUploadsController < ApplicationController
  def new
    @categories = Category.all.order(:name)
  end

  def preview
    default_category_id = params[:default_category_id].to_i
    amount_idx = params[:amount_col].to_i - 1
    paid_date_idx = params[:paid_date_col].to_i - 1
    description_idx = params[:description_col].to_i - 1
    category_idx = params[:category_col].to_i - 1
    spend_multiplier = params[:spend_format] == "negative" ? -1 : 1
    skip_existing = params[:skip_existing]
    categories = Category.all
    categories_ids_by_lower_name = categories.index_by { |c| c.name.downcase }.transform_values { |c| c.id }
    category_names_by_id = categories.index_by(&:id).transform_values { |c| c.name }

    file_contents = File.read(params[:file].tempfile)
    csv = CSV.parse(file_contents)

    rows = []
    csv.each do |row|
      amount = row[amount_idx].to_f * 100 * spend_multiplier
      paid_at = Chronic.parse(row[paid_date_idx])
      description = row[description_idx]

      category_id = default_category_id
      if category_idx >= 0 &&
        category = row[category_idx]
        category_id = (categories_ids_by_lower_name[category.downcase] || default_category_id) if category.present?
      end

      next if skip_existing && Expense.exists?(amount: amount, paid_at: paid_at, description: description)

      rows << { amount: amount, paid_at: paid_at, description: description, category_id: category_id, category_name: category_names_by_id[category_id] }
    end

    @categories = Category.all.order(:name).to_json
    @rows = rows.to_json
  end
end
