class CreateCsvConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :csv_configs do |t|
      t.text :name, null: false
      t.text :config_json, null: false

      t.timestamps
    end
  end
end
