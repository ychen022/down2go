class Cabal < ActiveRecord::Base
	has_and_belongs_to_many :users, class_name: 'User', join_table: 'cabal_users'
	
	def self.create_new_from_params(params)
		name=params[:name]
		date=params[:date]
		membersRaw=params[:members]
		members=membersRaw.split(/,/)
		cabal=Cabal.new(cabal_name:name, activity_date:date)
	end
	
	def name
	end
	
	def members_summary
	end
end
