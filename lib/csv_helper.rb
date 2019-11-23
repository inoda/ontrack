require 'csv'

# NOTE: This is committed to the codebase for versioning + persistence across computers.
# This helper is used to massage CSVs from a bank into a better format for importing into OnTrack.
# This helper will not be applicable/useful to everybody, but could be customized as needed.

# WARNING: I recommend copy/pasting this file somewhere else and then using it so that there's no risk
# of pushing up info that might reveal what bank you use.

# INTENDED USE: ruby csv_helper.rb in.csv out.csv

file_location = ARGV[0]
new_file_location = ARGV[1]

if file_location.nil? || file_location.strip.empty?
  puts "Specify your CSV file's location"
  return
end

if new_file_location.nil? || new_file_location.strip.empty?
  puts "Specify the new CSV file's location/name"
  return
end

puts "Using #{file_location} to create #{new_file_location}"

COLS_TO_DROP = [] # Index of col starting at 0 to omit from the output CSV (leave empty to keep all cols)
DESCRIPTION_SUBSTRINGS_TO_IGNORE = [] # Specify any substrings in a description that indicate the row should be skipped completely
KEEP_FIRST_ROW = false # Lets you drop a header row if there is one
FORMAT_DESCRIPTION = true # Stripes out special chars, titleizes, etc.
DESCRIPTION_INDEX = 1 # Only required if using DESCRIPTION_SUBSTRINGS_TO_IGNORE or FORMAT_DESCRIPTION
TXN_DATE_INDEX_AFTER_COLS_DROPPED = 0 # This is to sort by transaction date and should be the index of the txn date col *after* COLS_TO_DROP is applied

new_unsorted_rows = []
CSV.parse(File.read(file_location)).each_with_index do |row, i|
  next if i == 0 && KEEP_FIRST_ROW == false

  skip_row = false
  DESCRIPTION_SUBSTRINGS_TO_IGNORE.each do |desc|
    if row[DESCRIPTION_INDEX].include? desc
      skip_row = true
      break
    end
  end
  next if skip_row

  new_row = []
  row.each_with_index do |col, i|
    next if COLS_TO_DROP.include?(i) # Skip cols that were specified to drop

    if FORMAT_DESCRIPTION && i == DESCRIPTION_INDEX
      col = col.gsub(/(\d|\*|#)/, " ").gsub(/\s+/, ' ').strip.split.each{|x| x.capitalize!}.join(' ')
    end

    new_row << col.to_s.gsub(/\s+/, ' ') # Convert multiple spaces to 1 because statement descriptors can be weirdly formatted
  end

  new_unsorted_rows << new_row
end

new_sorted_rows = new_unsorted_rows.sort_by { |r| r[TXN_DATE_INDEX_AFTER_COLS_DROPPED] }.reverse

CSV.open(new_file_location, "wb") do |csv|
  new_sorted_rows.each { |r| csv << r }
end
