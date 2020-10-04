class RenamePasswordColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :password, :encrypted_password
    change_column_default :users, :encrypted_password, from: nil, to: ""
  end
end
