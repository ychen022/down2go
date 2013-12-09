// Insert the new pinpoint data. First insert a new agenda item into agenda,
// and then insert a new marker onto the map.
var updateAgendaArray = function(id, time, place, latitude, longitude){
  agenda_info.add({'id': id, 'time':time, 'place':place});
  agenda_info.sort();
  
  addPinToMap(id, time, place, latitude, longitude);
}

// Create a new marker with id, place, time, latitude and longitude,
// and then cache the marker.
var add_pin=function(id, place, time, latitude, longitude) {

    var Latlng = new google.maps.LatLng(latitude, longitude);

    //Create a new marker
    var marker = new google.maps.Marker({
        map: map,
        position: Latlng,
        title: place
    });

    //Create a short description for the place to fill out the marker's info window.
    var contentNode = document.createElement("div");
    contentNode.className = "infowindow_content";
    // Replace with desired string or dom element for the marker
    var nodeContent = document.createElement("p");
    nodeContent.innerHTML = place+", "+time;
    contentNode.appendChild(nodeContent);

    //create an info window for the marker.
    marker.infowindow = new google.maps.InfoWindow({
      content: contentNode
    });
    
    //cache the marker into the ppoints.
    ppoints.add(id, marker);

    //give each marker with its unique icons
    reassign_marker_icons();

    //add listeners onto each marker. When clicking it, the infoWindow will toggle.
    google.maps.event.addListener(marker, 'click', function(){
      ppoints.toggleInfoWindow(id);
    });
}

var updateAgendaWithDirection = function(id, time, place){
  updateAgendaArray(id, time, place);
  var aInfo = agenda_info.all();
  var car=$('#has_car').prop('checked');
  for (var i=0;i<aInfo.length-1;i++){
    if (aInfo[i].id===id){
      if (i===0){
        direction_loop_delayed(aInfo, i, i+1, car);
      }else if (i===aInfo.length-2){
        direction_loop_delayed(aInfo, i-1, i, car);
      }else{
        direction_loop_delayed(aInfo, i-1, i+1, car);
      }
      break;
    }
  }
}

// Clear the agenda.
var clearAgendaArray = function(){
  agenda_info.clear();
}

// Add a specific pinpoint(marker) onto the map.
var addPinToMap = function(id, time, place, latitude, longitude){
  add_pin(id, place, time, latitude, longitude);
}

// Remove a pinpoint(marker) from the map by id.
var removePinFromMap = function(id){
  ppoints.remove(id)
}

// Render the agenda description area using the current agenda
var rewriteAgenda = function(){
  infoText="";
  for (var i=0; i<agenda_info.length();i++){

    var new_div = '<li class="agendaitem" id='+agenda_info.get(i).id+'>'
    + '<div class="cbp_tmicon"></div>'
    + '<div class="cbp_tmlabel">'
    + '<h2>'
    + agenda_info.get(i).time 
    + '<a data-method="delete" data-remote="true" href="/pinpoints/'+agenda_info.get(i).id.toString()+'" rel="nofollow">\
    <span class="glyphicon glyphicon-remove pull-right" ></span></a>'
    + '</h2>'
    + '<div>'
    + agenda_info.get(i).place
    + '</div>'
    + '<div class="routeEval"></div>'
    + '</li>';

    infoText += new_div;
  }
  $("#pinpoints_info").html(infoText);
}

// Remove an item from the agenda.
var removeAgendaItem=function(theid){
  $('#'+theid).remove();
  for (var i=0; i<agenda_info.length(); i++){
    if (agenda_info.get(i).id==theid){
      agenda_info.remove(i);
    }
  }
}
