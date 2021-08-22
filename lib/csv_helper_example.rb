require 'csv'

# NOTE:
# This helper is used to massage CSVs from a bank into a better format for importing into OnTrack.
# This helper will not be applicable/useful to everybody, but could be customized as needed.

# WARNING: I recommend not commiting changes to this file publicly, because it might reveal what bank you use.

# INTENDED USE: ruby csv_helper.rb in.csv

GENERAL_CONFIG = {
  has_header: true,
  drop_cols_at_indicies: [1, 2, 3] # (leave empty to keep all cols)
}
DESCRIPTION_CONFIG = {
  format: true,
  find_at_index_in_original_csv: 4,
  substrings_to_ignore: ["Payment submitted"] # Specify any substrings in a description that indicate the row should be skipped completely,
}
CATEGORY_CONFIG = {
  find_at_index_in_original_csv: 5,
  mappings: {
    'Gas' => 'Car',
  }
}

file_location = ARGV[0]&.strip
timestamp = Time.now

if file_location.nil? || file_location.empty?
  puts "Specify your CSV file's location"
  return
end

new_file_location = (file_location.split("/").tap(&:pop) + ["ontrack_csv_#{timestamp.to_i}.csv"]).join('/')

rows = []
CSV.parse(File.read(file_location)).each_with_index do |row, i|
  if i == 0 && GENERAL_CONFIG[:has_header]
    puts "Skipping row: #{row}"
    next
  end

  if DESCRIPTION_CONFIG[:substrings_to_ignore].any? { |desc| row[DESCRIPTION_CONFIG[:find_at_index_in_original_csv]].include? desc }
    puts "Skipping row: #{row}"
    next
  end

  new_row = []
  row.each_with_index do |col, i|
    next if GENERAL_CONFIG[:drop_cols_at_indicies].include?(i)

    if i == DESCRIPTION_CONFIG[:find_at_index_in_original_csv] && DESCRIPTION_CONFIG[:format]
      col = col.gsub(/(\W|\d)/, " ").gsub(/\s+/, ' ').strip.split.map { |d| d.downcase.capitalize }.join(' ')
    end

    if i == CATEGORY_CONFIG[:find_at_index_in_original_csv]
      col = CATEGORY_CONFIG[:mappings][col.to_s] || col
    end

    new_row << col
  end

  rows << new_row
end

CSV.open(new_file_location, "wb") do |csv|
  rows.each { |r| csv << r }
end

puts
puts "DONE: Written to #{new_file_location}"
