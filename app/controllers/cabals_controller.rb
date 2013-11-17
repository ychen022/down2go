class CabalsController < ApplicationController
	before_action :authenticate_user!
	before_action :set_cabal, only: [:show, :add_member]
	
	def index
		@cabals=[]
		if !current_user.cabals.nil?
			@cabals=current_user.cabals
		end
	end
	
	def new
		@cabal=Cabal.new
	end
	
	def create
		@cabal = Cabal.create_new_from_params(current_user,params)
		render :show
	end
	
	def show
		@cabal=Cabal.find_by_id(params[:id])
		@pinpoints = @cabal.pinpoints
		@message = Message.new(user_id: current_user.id, cabal_id: params[:id])
		@pinpoint = Pinpoint.new(cabal_id: params[:id])
	end
	
	# Add a member to the cabal. Will change to ajax later.
	def add_member
		result=@cabal.add_member(params[:username])
		if result==0
			flash.now[:alert] = "User does not exist"
		elsif result==-1
			flash.now[:alert] = "User already in cabal"
		else
			flash.now[:notice] = "Successfully added user to cabal"
		end
		render :show 
	end
	
	private
		def set_cabal
			@cabal=Cabal.find_by_id(params[:id])
		end
end
