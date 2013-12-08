class AddCoordinateToPinpoints < ActiveRecord::Migration
  def change
    add_column :pinpoints, :latitude, :string
    add_column :pinpoints, :longitude, :string
  end
end
