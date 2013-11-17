class Adduserandcabalidtomessage < ActiveRecord::Migration
  def change
    add_column :messages, :user_id, :integer
    add_index :messages, :user_id
    add_column :messages, :cabal_id, :integer
    add_index :messages, :cabal_id
  end
end
