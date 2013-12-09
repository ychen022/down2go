//This data structure represents all the markers (that compose the agenda) and their related
//direction results on the map. 
Pinpoints = function(){
  // Markers on the map
  var pins = {};
  // Direction results between pairs of markers
  var directions = {};

  //Google Map does not support an function to check if an infoWindow is open for a pinpoint
  //is open. So we need to add an attribute by ourselves to keep track. 
  google.maps.InfoWindow.prototype.opened = false;

  return {
    //return all the markers
    all: function() {return pins;},

    //get a marker with a specific id. 
    //this "id" is the id of the corresponding pinpoint in the database
    get: function(id) {return pins[id];},
    
    //associate an id with a direction api response.
    add_direction: function(id, direction) {directions[id]=direction;},
    
    get_direction: function(id) {return directions[id];},
    
    remove_direction: function(id) {
      if (directions[id]!=null){
          delete directions[id];
      }
    },

    //add a marker with a specific id. 
    //this "id" is the id of the corresponding pinpoint in the database
    add: function(id, marker) {pins[id]=marker;},

    //remove a marker with a specific id.
    //this "id" is the id of the corresponding pinpoint in the database
    remove: function(id) {
      if (pins[id]!=null){
        pins[id].setMap(null);
        delete pins[id];
      }
      if (directions[id]!=null){
        delete directions[id];
      }
    },

    //If a marker's infowindow is open, close it down; otherwise, open the infowindow.
    //Additionally, display the route of transit from the marker to the next agenda item's marker.
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