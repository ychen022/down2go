class AddNameAndDateToCabals < ActiveRecord::Migration
  def change
    add_column :cabals, :cabal_name, :text
    add_column :cabals, :activity_date, :date
  end
end
