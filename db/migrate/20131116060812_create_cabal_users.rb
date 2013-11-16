class CreateCabalUsers < ActiveRecord::Migration
  def change
    create_join_table :users, :cabals, table_name: :cabal_users
  end
end
