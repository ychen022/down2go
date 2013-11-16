class CabalsController < ApplicationController

	def index
		@cabals=[]
	end
	
	def new
		@cabal=Cabal.new
		render :show
	end
	
	def show
	end
end
