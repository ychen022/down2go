Pinpoints = function(){
  var pins = {};
  var directions = {};
  google.maps.InfoWindow.prototype.opened = false;
  return {
    all: function() {return pins;},
    get: function(id) {return pins[id];},
    add_direction: function(id, direction) {directions[id]=direction;},
    get_direction: function(id) {return directions[id];},
    add: function(id, marker) {pins[id]=marker;},
    remove: function(id) {
      if (pins[id]!=null){
        pins[id].setMap(null);
        delete pins[id];
      }
      if (directions[id]!=null){
        delete directions[id];
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
      if (directions[id]){
        directionsDisplay.setDirections(directions[id]);
      }
    }
  };
}