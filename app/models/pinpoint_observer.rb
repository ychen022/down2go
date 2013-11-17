class PinpointObserver < ActiveRecord::Observer
  def after_create(pinpoint)
    place = pinpoint.place
    time = pinpoint.time
    cabal_id = pinpoint.cabal_id
    Pusher[('cabal-' + cabal_id.to_s())].trigger!('pinpoint', {:place => place, :time => time})
  end

  def before_destroy(pinpoint)
    
  end 
end
