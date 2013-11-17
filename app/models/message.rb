class Message < ActiveRecord::Base
  belongs_to :user
  belongs_to :cabal

  validates :user_id, presence: true
  validates :cabal_id, presence: true
  validates :content, presence: true

end
