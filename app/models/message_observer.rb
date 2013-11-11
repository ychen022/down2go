class MessageObserver < ActiveRecord::Observer
  def after_create(message)
    Pusher['chat'].trigger!('messages', {:content => message.content})
  end
end
