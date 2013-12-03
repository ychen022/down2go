// TODO change those global variables to more secure implementations.
var agenda_info;
var ppoints;
var geocoder;
var map;

Pinpoints = function(){
  var pins = {};
  return {
    all: function() {return pins;},
    get: function(id) {return pins[id];},
    add: function(id, marker) {pins[id]=marker;},
    remove: function(id) {
      if (pins[id]!=null){
        pins[id].setMap(null);
        delete pins[id];
      }
    }
  };
}

AgendaInfo = function(){
  var agenda_info=new Array();
  return {
    all: function() {return agenda_info;},
    get: function(index) {return agenda_info[index];},
    add: function(item) {agenda_info.push(item);},
    remove: function(index) {agenda_info.splice(index, 1);},
    sort: function() {
      agenda_info.sort(function(a,b){
        //var dateA=new Date(a.time);
        //var dateB=new Date(b.time);
        //return dateA-dateB;
        return a.time-b.time;
      });
    },
    clear: function() {agenda_info = new Array();},
    length: function() {return agenda_info.length;}
  };
}
    

var ready;
ready = function() {
  //When changing the time field, the hidden field updates
  $(".pinpoint-time").change(function(){
    var $time_field = $(".pinpoint-time-hidden");
    var $time_field_am = $(".pinpoint-time-am");
    var time = $(this).val() + " " + $time_field_am.val();
    $time_field.val(time);
  });

  //When changing the time am field, the hidden field updates
  $(".pinpoint-time-am").change(function(){
    var $time_field = $(".pinpoint-time-hidden");
    var $time_field_raw = $(".pinpoint-time");
    var time = $time_field_raw.val() + " " + $(this).val();
    $time_field.val(time);
  });

  //When clicking #gochat button, the chat area toggles
  $('#gochat').click(function(){
    var $chat_area = $('#chat_area');
    if($chat_area.css("display") == "none"){
      $chat_area.css("display", "block");
    } else {
      $chat_area.css("display", "none");
    }
  });

  //When clicking #gomembers button, the member area toggles
  $('#gomembers').click(function(){
    var $member_area = $('#member_area');
    if($member_area.css("display") == "none"){
      $member_area.css("display", "block");
    } else {
      $member_area.css("display", "none");
    }
  });
};

$(document).ready(function(){
  ready();
  ppoints = Pinpoints();
  agenda_info = AgendaInfo();
});
$(document).on('page:load', function(){
  ready();
  ppoints = Pinpoints();
  agenda_info = AgendaInfo();
});
  

