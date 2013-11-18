class PinpointObserver < ActiveRecord::Observer
  def after_create(pinpoint)
    place = pinpoint.place
    time = pinpoint.time
    cabal_id = pinpoint.cabal_id
    Pusher[('cabal-' + cabal_id.to_s())].trigger!('pinpoint', {:id => pinpoint.id, :place => place, :time => time.strftime("%I:%M %p")})
  end

  def before_destroy(pinpoint)
    cabal_id = pinpoint.cabal_id
    Pusher[('cabal-' + cabal_id.to_s())].trigger!('delete-pinpoint', {:id => pinpoint.id})
  end 
end
