class CabalsController < ApplicationController

	def index
		@cabals=[]
	end
	
	def new
		@cabal=Cabal.new
	end
	
	def create
		@cabal = Cabal.create_new_from_params(params)
		@cabal.save
		render :show
	end
	
	def show
	end
end
