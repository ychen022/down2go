class CabalsController < ApplicationController
	before_action :authenticate_user!
	
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
	end
	
	private
		
end
