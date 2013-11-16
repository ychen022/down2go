class CreateCabals < ActiveRecord::Migration
  def change
    create_table :cabals do |t|

      t.timestamps
    end
  end
end
