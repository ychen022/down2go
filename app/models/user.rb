class User < ActiveRecord::Base
	has_and_belongs_to_many :cabals, class_name: 'Cabal', join_table: 'cabal_users'
  has_many :messages

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
	validates_presence_of :username
  validates_uniqueness_of :username
end
