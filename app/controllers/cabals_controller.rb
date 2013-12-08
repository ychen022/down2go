class CabalsController < ApplicationController
    before_action :authenticate_user!
    before_action :check_cabal_permission, only: [:show, :add_member, :sync, :quit_cabal]
    before_action :set_cabal, only: [:show, :add_member, :sync, :quit_cabal]
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
        @cabal = Cabal.create_new_from_params(current_user,cabal_params)
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
        # result=@cabal.add_member(params[:username])
        # if result==0
        #     #flash[:alert] = "User does not exist. "
        #     notice = "User does not exist. "
        # elsif result==-1
        #     #flash[:alert] = "User already in cabal. "
        #     notice = "User already in cabal. "
        # else
        #     #flash[:notice] = "Successfully added user to cabal. "
        #     notice = "Successfully added user to cabal. "
        # end
        # notice = ""
        #json_response = { :notice => notice}
        respond_to do |format|
            format.html {redirect_to cabal_path(@cabal)}
            format.js {}
            #format.json {render :json => json_response}
        end
        #redirect_to cabal_path(@cabal)
    end

    # Render the existing pinpoints on the cabal page.
    def sync
        @pinpoints=@cabal.pinpoints
        respond_to do |format|
            format.js
        end
    end

    # Removes the current user from the specified cabal through model method.
    # May remove the cabal as well if it's empty.
    def quit_cabal
        result=@cabal.remove_member(current_user)
        if result==0
            flash[:alert] = "User does not exist. "
        else
            if result==-1
                @cabal.destroy
            end
            flash[:notice] = "Successfully exited cabal. "
        end
        redirect_to root_url
    end

    private
    # Set the cabal the user is currently working on by id.
    def set_cabal
        @cabal=Cabal.find_by_id(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cabal_params
        params.permit(:name, :date, :members)
    end

    # Set a blank message to start the chat 
    def init_message
        @message = Message.new(user_id: current_user.id, cabal_id: params[:id])
    end

    # Check if the current user has the permission to access the  
    # specified cabal. Redirects to the cabal listing if violated.
    def check_cabal_permission
        if !current_user.cabals.include?(Cabal.find_by_id(params[:id]))
            flash[:error] = 'You do not have the right permission to access this group!'
            redirect_to(root_url) 
        end
    end
end
