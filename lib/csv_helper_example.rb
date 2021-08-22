require 'csv'

# NOTE:
# This helper is used to massage CSVs from a bank into a better format for importing into OnTrack.
# This helper will not be applicable/useful to everybody, but could be customized as needed.

# WARNING: I recommend not commiting changes to this file publicly, because it might reveal what bank you use.

# INTENDED USE: ruby csv_helper.rb in.csv

HAS_HEADER = true # Lets you drop a header row if there is one
COLS_TO_DROP = [0, 1, 2] # Index of col starting at 0 to omit from the output CSV (leave empty to keep all cols)
DESCRIPTION_INDEX = 3 # Index of col that holds the description
DESCRIPTION_SUBSTRINGS_TO_IGNORE = ["Made a payment"] # Specify any substrings in a description that indicate the row should be skipped completely
FORMAT_DESCRIPTION = true # Stripes out special chars, titleizes, etc.

file_location = ARGV[0]&.strip
timestamp = Time.now

if file_location.nil? || file_location.empty?
  puts "Specify your CSV file's location"
  return
end

new_file_location = (file_location.split("/").tap(&:pop) + ["ontrack_csv_#{timestamp.to_i}.csv"]).join('/')

rows = []
CSV.parse(File.read(file_location)).each_with_index do |row, i|
  if i == 0 && HAS_HEADER
    puts "Skipping row: #{row}"
    next
  end

  if DESCRIPTION_SUBSTRINGS_TO_IGNORE.any? { |desc| row[DESCRIPTION_INDEX].include? desc }
    puts "Skipping row: #{row}"
    next
  end

  new_row = []
  row.each_with_index do |col, i|
    next if COLS_TO_DROP.include?(i) # Skip cols that were specified to drop

    if FORMAT_DESCRIPTION && i == DESCRIPTION_INDEX
      col = col.gsub(/(\W|\d)/, " ").gsub(/\s+/, ' ').strip.split.map { |d| d.downcase.capitalize }.join(' ')
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
