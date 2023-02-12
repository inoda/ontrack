class AddLocaleToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :locale, :string, default: "en-US"
    add_column :users, :currency_iso, :string, default: "USD"
  end
end
