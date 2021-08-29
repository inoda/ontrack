class CsvProcessor
  def initialize(csv_rows, csv_config, default_category_id = nil)
    @csv_rows = csv_rows
    @config = csv_config
    @default_category_id = default_category_id
    @categories_ids_by_lower_name = Category.all.index_by { |c| c.name.downcase }.transform_values { |c| c.id }
  end

  def process!
    output = []
    @csv_rows.each_with_index do |row, i|
      next if skip_row?(row, i)
      output << process_row(row)
    end
    output
  end

  private

  def description_index
    @config.dig('descriptions', 'index') || raise('Missing description index')
  end

  def category_index
    @config.dig('categories', 'index') || raise('Missing category index')
  end

  def amount_index
    @config.dig('amounts', 'index') || raise('Missing amount index')
  end

  def date_index
    @config.dig('timestamps', 'index') || raise('Missing date index')
  end

  def description_substrings_to_ignore
    @config.dig('descriptions', 'ignore_substrings') || []
  end

  def category_mappings
    @config.dig('categories', 'mappings') || {}
  end

  def amount_skip_non_spend
    @config.dig('amounts', 'skip_non_spend') || false
  end

  def amount_is_negative
    @config.dig('amounts', 'spend_is_negative') || false
  end

  def has_header
    @config['has_header'] || false
  end

  def spend_multiplier
    amount_is_negative ? -1 : 1
  end

  def skip_row?(row, index)
    if index == 0 && has_header
      return true
    end

    if description_substrings_to_ignore.any? { |str| row[description_index].include? str }
      return true
    end

    if amount_skip_non_spend && row[amount_index].to_f > 0
      return true
    end

    false
  end

  def process_row(row)
    category_id = get_category_id(row)
    date = row[date_index]
    description = row[description_index]
    amount = row[amount_index]

    {
      paid_at: Chronic.parse(date),
      description: format_description(description),
      category_id: category_id,
      amount: amount.to_f * 100 * spend_multiplier,
    }
  end

  def get_category_id(row)
    category = row[category_index]
    mapped_category = category_mappings[category] || category
    @categories_ids_by_lower_name[mapped_category.downcase] || @default_category_id
  end

  def format_description(s)
    desc = s.gsub(/(\W|\d)/, ' ') # strip non word chars
    desc = desc.gsub(/\s+/, ' ').strip # normalize multiple spaces
    desc = desc.split.map { |d| d.downcase.capitalize }.join(' ') # titleize
    desc
  end
end
