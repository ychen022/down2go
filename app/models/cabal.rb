class Cabal < ActiveRecord::Base
	has_and_belongs_to_many :users, class_name: 'User', join_table: 'cabal_users'
	has_many :messages
	has_many :pinpoints
	
	validates_presence_of :activity_date
	
	# Creates a new cabal from the parameters and associates cabals and users.
	# If there are non-existent users or duplicate users in the initial list of users
	# in the parameters, the cabal will still be created but error alert will be displayed.
	def self.create_new_from_params(user,params)
		name=params[:name]
		date=params[:date]
		membersRaw=params[:members]
		if membersRaw.nil?
			members = []
		else
			members=membersRaw.split(/\s*,\s*/)
		end
		cabal=user.cabals.new(cabal_name:name, activity_date:date)
		if !cabal.save
			return nil
		end
		cabal.users<<user
		members.each do |m|
			iu=User.find_by_username(m)
			if !iu.nil?
				if cabal.users.include?(iu)
					cabal.errors.add(:username, "User "+m+" already in cabal. ")
				else
					cabal.users<<iu
				end
			else
				cabal.errors.add(:username, "User "+m+" not found. ")
			end
		end
		return cabal
	end
	
	# Add a member to the cabal.
	# Take a username as an input.
	# Returns 0 for nonexistant user, 1 for success, -1 for user already in cabal.
	def add_member(user)
		u=User.find_by_username(user)
		if u.nil?
			self.errors.add(:username, "User "+user+" does not exist")
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
	
	# Removes a user from the cabal.
	# Should only ever be called on behalf of the removed user himself.
	# Takes the user object as input.
	# Returns 0 if user is not in the cabal, 1 if user removed successfully and 
	# there are remaining users, -1 for last user removed.
	def remove_member(user)
		if !self.users.include?(user)
			return 0
		end
		self.users.delete(user)
		self.save
		if self.users.length==0
			return -1
		else
			return 1
		end
	end
			
	
	# Return the name string of the cabal if it's not empty, or "nameless cabal" if it is.
	def name
		if self.cabal_name==""
			return "Nameless Cabal"
		else
			return self.cabal_name
		end
	end
	
	# Return a summary string of the users in the group. The summary contains the username of
	# up to 3 users and the number of other users if there are more.
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
