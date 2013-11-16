class Cabal < ActiveRecord::Base
	has_and_belongs_to_many :users, class_name: 'User', join_table: 'cabal_users'
	def name
	end
	
	def members_summary
	end
end
