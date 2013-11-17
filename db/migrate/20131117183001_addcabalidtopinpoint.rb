class Addcabalidtopinpoint < ActiveRecord::Migration
  def change
    add_column :pinpoints, :cabal_id, :integer
    add_index :pinpoints, :cabal_id
  end
end
