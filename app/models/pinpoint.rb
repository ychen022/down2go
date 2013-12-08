class Pinpoint < ActiveRecord::Base
  belongs_to :cabal

  validates :time, presence: true
  validates :cabal_id, presence: true
  validates :place, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true
end
