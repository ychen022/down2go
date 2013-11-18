class CabalsController < ApplicationController
	before_action :authenticate_user!
	before_action :set_cabal, only: [:show, :add_member, :sync]
	before_action :init_message, only: [:show]
	
	# Show the list of cabals that the user is participating in.
	def index
		@cabals=[]
		if !current_user.cabals.nil?
			@cabals=current_user.cabals
		end
	end
	
	# Show the page to create a cabal.
	def new
		@cabal=Cabal.new
	end
	
	# Attempt to create the cabal with provided info.
	def create
		@cabal = Cabal.create_new_from_params(current_user,params)
		if @cabal.nil?
			flash.now[:alert] = "Failed to create cabal. Please check your details."
			render :new
		else
			flash[:alert] = "Cabal created. "
			if @cabal.errors.any?
				@cabal.errors[:username].each do |e|
					flash[:alert] += e
				end
			end
			redirect_to cabal_path(@cabal)
		end
	end
	
	# Display the cabal page.
	def show
		@pinpoints = @cabal.pinpoints
		@pinpoint = Pinpoint.new(cabal_id: params[:id])
	end
	
	# Add a member to the cabal. 
	# TODO change to ajax
	def add_member
		result=@cabal.add_member(params[:username])
		if result==0
			flash.now[:alert] = "User does not exist. "
		elsif result==-1
			flash.now[:alert] = "User already in cabal. "
		else
			flash.now[:notice] = "Successfully added user to cabal. "
		end
		redirect_to cabal_path(@cabal)
	end
	
	# Render the existing pinpoints on the cabal page.
	def sync
		@pinpoints=@cabal.pinpoints
		respond_to do |format|
			format.js
		end
	end
	
	private
		# Set the cabal the user is currently working on.
		def set_cabal
			@cabal=Cabal.find_by_id(params[:id])
		end
		
		# Set a blank message to start the chat 
		def init_message
			@message = Message.new(user_id: current_user.id, cabal_id: params[:id])
		end
end
