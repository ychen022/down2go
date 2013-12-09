Pinpoints = function(){
  var pins = {};
  google.maps.InfoWindow.prototype.opened = false;
  return {
    all: function() {return pins;},
    get: function(id) {return pins[id];},
    add: function(id, marker) {pins[id]=marker;},
    remove: function(id) {
      if (pins[id]!=null){
        pins[id].setMap(null);
        delete pins[id];
      }
    },
    toggleInfoWindow: function(id) {
      var pin = pins[id];
      var infoWindow = pin.infowindow;
      if(infoWindow.opened){
          infoWindow.close();
          infoWindow.opened = false;
      }
      else{
          infoWindow.open(map, pin);
          infoWindow.opened = true;
      }
    }
  };
}