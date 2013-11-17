class CreatePinpoints < ActiveRecord::Migration
  def change
    create_table :pinpoints do |t|
      t.string :place
      t.time :time

      t.timestamps
    end
  end
end
