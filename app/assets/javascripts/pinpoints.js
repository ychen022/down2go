// Insert the new pinpoint data into the agenda array.
var updateAgendaArray = function(id, time, place){
  console.log(time);
  agenda_info.add({'id': id, 'time':time, 'place':place});
  agenda_info.sort();
  
  addPinToMap(id, time, place);
}

// Clear the agenda array.
var clearAgendaArray = function(){
  agenda_info.clear();
}

// Add a specified pinpoint to the map.
var addPinToMap = function(id, time, place){
  console.log("updating map");
  add_pin(id, place, time);
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
    infoText+='<div class="info_line agendalist" id='+agenda_info.get(i).id+'>\
    <a data-method="delete" data-remote="true" href="/pinpoints/'+agenda_info.get(i).id.toString()+'" rel="nofollow">\
    <span class="glyphicon glyphicon-remove pull-right" ></span></a>'+agenda_info.get(i).time+"<br />"+agenda_info.get(i).place+"<br />\
    </div>";
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
