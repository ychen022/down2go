// Insert the new pinpoint data into the agenda array.
var updateAgendaArray = function(id, time, place){
  agenda_info.push({'id': id, 'time':time, 'place':place});
  agenda_info.sort(function(a,b){
    var dateA=new Date(a.time);
    var dateB=new Date(b.time);
    return dateA-dateB;
  });
  
  addPinToMap(id, time, place);
}

// Clear the agenda array.
var clearAgendaArray = function(){
  agenda_info = new Array();
}

// Add a specified pinpoint to the map.
var addPinToMap = function(id, time, place){
  console.log("updating map");
  add_pin(id, place, time);
  console.log("map updated");
}

// Remove a pinpoint from the map by id.
var removePinFromMap = function(id){
  if (pins[id]!=null){
    pins[id].setMap(null);
    delete pins[id];
  }
}

// Render the agenda description area.
var rewriteAgenda = function(){
  infoText="";
  for (var i=0; i<agenda_info.length;i++){
    infoText+='<div class="info_line agendalist" id='+agenda_info[i].id+'>\
    <a data-method="delete" data-remote="true" href="/pinpoints/'+agenda_info[i].id.toString()+'" rel="nofollow">\
    <span class="glyphicon glyphicon-remove pull-right" ></span></a>'+agenda_info[i].time+"<br />"+agenda_info[i].place+"<br />\
    </div>";
  }
  $("#pinpoints_info").html(infoText);
}

// Remove an item from the agenda.
var removeAgendaItem=function(theid){
  $('#'+theid).remove();
  for (var i=0; i<agenda_info.length; i++){
    if (agenda_info[i].id==theid){
      agenda_info.splice(i, 1);
    }
  }
}
