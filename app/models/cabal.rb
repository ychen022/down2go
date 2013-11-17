class Cabal < ActiveRecord::Base
	has_and_belongs_to_many :users, class_name: 'User', join_table: 'cabal_users'
	has_many :messages
	has_many :pinpoints
	
	# Creates a new cabal from the parameters and associates cabals and users
	# TODO use errors properly
	def self.create_new_from_params(user,params)
		name=params[:name]
		date=params[:date]
		membersRaw=params[:members]
		members=membersRaw.split(/\s*,\s*/)
		cabal=user.cabals.create(cabal_name:name, activity_date:date)
		members.each do |m|
			iu=User.find_by_username(m)
			if !iu.nil?
				if cabal.users.include?(iu)
					cabal.errors.add(:username, "User already in cabal")
				else
					cabal.users<<iu
				end
			else
				cabal.errors.add(:username, "User not found")
			end
		end
		return cabal
	end
	
	# Take a username as an input
	# Returns 0 for nonexistant user, 1 for success, -1 for user already in cabal
	def add_member(user)
		u=User.find_by_username(user)
		if u.nil?
			self.errors.add(:username, "User does not exist")
			return 0
		else
			if !self.users.include?(u)
				self.users<<u
				return 1
			else
				return -1
			end
		end
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
