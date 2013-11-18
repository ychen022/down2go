var updateAgendaArray = function(id, time, place){
  agenda_info.push({'id': id, 'time':time, 'place':place});
  agenda_info.sort(function(a,b){
    var dateA=new Date(a.time);
    var dateB=new Date(b.time);
    return dateA-dateB;
  });
  
  addPinToMap(id, time, place);
}

var addPinToMap = function(id, time, place){
  console.log("updating map");
  add_pin(id, place, time);
  console.log("map updated");
}

var removePinFromMap = function(id){
  if (pins[id]!=null){
    pins[id].setMap(null);
    delete pins[id];
  }
}

var rewriteAgenda = function(){
  infoText="";
  for (var i=0; i<agenda_info.length;i++){
    infoText+='<div class="info_line agendalist" id='+agenda_info[i].id+'>'
    infoText+=agenda_info[i].time;
    infoText+="<br />";
    infoText+=agenda_info[i].place;
    infoText+="<br />";
    infoText+='<a data-method="delete" data-remote="true" href="/pinpoints/'+agenda_info[i].id.toString()+'" rel="nofollow">delete</a>';
    infoText+="</div>";
  }
  $("#pinpoints_info").html(infoText);
}

var removeAgendaItem=function(theid){
  $('#'+theid).remove();
  for (var i=0; i<agenda_info.length; i++){
    if (agenda_info[i].id==theid){
      agenda_info.splice(i, 1);
    }
  }
}
