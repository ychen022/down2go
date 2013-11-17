class Cabal < ActiveRecord::Base
	has_and_belongs_to_many :users, class_name: 'User', join_table: 'cabal_users'
	
	def self.create_new_from_params(user,params)
		name=params[:name]
		date=params[:date]
		membersRaw=params[:members]
		members=membersRaw.split(/,/)
		cabal=user.cabals.create(cabal_name:name, activity_date:date)
		members.each do |m|
			iu=User.find_by_username(m)
			if !iu.nil?
				#iu.cabals<<cabal
				cabal.users<<iu
			end
		end
		return cabal
	end
	
	def name
		if self.cabal_name==""
			return "Nameless Cabal"
		else
			return self.cabal_name
		end
	end
	
	def members_summary
		output=""
		msize = [2, self.users.size-1].min
		for i in 0..msize
			output+=self.users[i].username
			output+=" "
		end
		if self.users.size>3
			output+="and "+(self.users.size-3).to_s+" more"
		end
		return output
	end
end
