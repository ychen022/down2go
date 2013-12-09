// Insert the new pinpoint data into the agenda array.
var updateAgendaArray = function(id, time, place, latitude, longitude){
  console.log(time);
  agenda_info.add({'id': id, 'time':time, 'place':place});
  agenda_info.sort();
  
  addPinToMap(id, time, place, latitude, longitude);
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

// Clear the agenda array.
var clearAgendaArray = function(){
  agenda_info.clear();
}

// Add a specified pinpoint to the map.
var addPinToMap = function(id, time, place, latitude, longitude){
  console.log("updating map");
  add_pin(id, place, time, latitude, longitude);
  console.log("map updated");
}

// Remove a pinpoint from the map by id.
var removePinFromMap = function(id){
  ppoints.remove(id)
}

// Render the agenda description area.
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
