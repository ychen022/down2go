class PinpointsController < ApplicationController
    
  def create 
    @pinpoint = Pinpoint.create(pinpoint_params)
    check_pinpoint_cabal
    respond_to do |format|
      if @pinpoint.save 
        format.js 
      else
        format.js
      end
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def pinpoint_params
      params.require(:pinpoint).permit(:place, :time, :cabal_id)
    end

    def check_pinpoint_cabal
      if !current_user.cabals.include?(Cabal.find_by_id(pinpoint_params[:cabal_id]))
        flash[:error] = 'You do not have the right permission to add a pinpoint in another group!'
        redirect_to(root_url) 
      end
    end
end
