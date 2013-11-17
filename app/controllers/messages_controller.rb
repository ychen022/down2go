class MessagesController < ApplicationController
	#before_action :authenticate_user!

  def index 
    @message = Message.new
  end

  def create
    @message = current_user.messages.build(message_params)
    check_message_cabal
    respond_to do |format|
      if @message.save 
        format.js 
      else
        format.js
      end
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def message_params
      params.require(:message).permit(:content, :cabal_id)
    end

    def check_message_cabal
      if !current_user.cabals.include?(Cabal.find_by_id(message_params[:cabal_id]))
        flash[:error] = 'You do not have the right permission to post a message in another group!'
        redirect_to(root_url) 
      end
    end
end
