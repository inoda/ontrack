# TO CREATE A CONFIG (in Rails console):
#
# config = {
#   'has_header' => true,
#   'descriptions' => {
#     'index' => 0,
#     'ignore_substrings' => ['Payment made'],
#   },
#   'categories' => {
#     'index' => 1,
#     'mappings' => {
#       'Gas' => 'Car',
#     },
#   },
#   'amounts' => {
#     'index' => 2,
#     'spend_is_negative' => true,
#     'skip_non_spend' => false,
#   },
#   'timestamps' => {
#     'index' => 3,
#   },
#   'auto_detect' => {
#     'filename_substring' => 'account1234',
#     'default_category' => 'Uncategorized'
#   },
# }
#
# CsvConfig.create!(name: 'Checking account CSVs', config_json: config.to_json)

class CsvConfig < ApplicationRecord
  validates_presence_of :name, :config_json

  validate :json_format

  def json_format
    keys_to_validate = [
      ['has_header'],
      ['descriptions', 'index'],
      ['descriptions', 'ignore_substrings'],
      ['categories', 'index'],
      ['categories', 'mappings'],
      ['amounts', 'index'],
      ['amounts', 'spend_is_negative'],
      ['amounts', 'skip_non_spend'],
      ['timestamps', 'index'],
    ]

    config = JSON.parse(config_json)

    if keys_to_validate.any? { |path| config.dig(*path).nil? }
      errors.add(:config_json, "Invalid format. View app/models/csv_config.rb for an example.")
    end
  end
end
