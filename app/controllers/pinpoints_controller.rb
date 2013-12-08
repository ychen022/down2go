class PinpointsController < ApplicationController
  before_action :set_pinpoint, only: [:destroy]
	before_action :check_pinpoint_permission, only: [:create]
	
	# Create a pinpoint from the parameters received (place, time, cabal id)
  def create 
    @pinpoint = Pinpoint.create(pinpoint_params)
    respond_to do |format|
      if @pinpoint.save 
        format.js 
      else
        format.js { render :action => "create_fail" }
      end
    end
  end
	
	# Remove the specified pinpoint by id
	def destroy
		respond_to do |format|
			format.js
		end
		@pinpoint.destroy
	end
	
  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def pinpoint_params
      params.require(:pinpoint).permit(:place, :time, :cabal_id, :latitude, :longitude)
    end

		# Check if the current user has the permission to create the pinpoint in the 
		# specified cabal. Redirects to the cabal listing if violated.
    def check_pinpoint_permission
      if !current_user.cabals.include?(Cabal.find_by_id(pinpoint_params[:cabal_id]))
        flash[:error] = 'You do not have the right permission to create a pinpoint in another group!'
        redirect_to(root_url) 
      end
    end
		
		# Sets the current working pinpoint by id.
		def set_pinpoint
			@pinpoint = Pinpoint.find_by_id(params[:id])
		end
end
