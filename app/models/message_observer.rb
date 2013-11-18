class MessageObserver < ActiveRecord::Observer
  def after_create(message)
    cabal_id = message.cabal_id
    username = message.user.username
    Pusher[('cabal-' + cabal_id.to_s())].trigger!('chat', {:username => username, :content => message.content})
  end
end
