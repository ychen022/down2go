// TODO change those global variables to more secure implementations.
var agenda_info;
var ppoints;
var remnant_markers;
var geocoder;
var map;
var directionsService;

Remnant_markers = function(){
  var markers = [];

  var that = {};
  that.add_marker = function(marker){
    markers.push(marker);
  };

  that.clear = function(){
    utils.each(markers, function(marker) {
      marker.setMap(null);
    });
    markers.length = 0;
  };    

  Object.freeze(that);
  return that;
}

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
        var ah = parseInt(a.time.substring(0,2));
        var bh = parseInt(b.time.substring(0,2));
        if ((a.time.substring(6,8)==="PM") && (a.time.substring(0,2)!="12")){
          ah+=12;
        }else if((a.time.substring(6,8)==="AM") && (a.time.substring(0,2)==="12")){
          ah=0;
        }
        if ((b.time.substring(6,8)==="PM") && (b.time.substring(0,2)!="12")){
          bh+=12;
        }else if((b.time.substring(6,8)==="AM") && (b.time.substring(0,2)==="12")){
          bh=0;
        }
        return ah*60+parseInt(a.time.substring(3,5))-bh*60-parseInt(b.time.substring(3,5));
        //var dateA=new Date(a.time);
        //var dateB=new Date(b.time);
        //return dateA-dateB;
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
  
  $('#message_content').keypress(function(evt){
    var charCode = (evt.which) ? evt.which : window.event.keyCode; 
		if (charCode == 13){ 
      event.preventDefault();
      $('#new_message').submit();
    } 
  });
};

$(document).ready(function(){
  ready();
  ppoints = Pinpoints();
  remnant_markers = Remnant_markers();
  agenda_info = AgendaInfo();
});
$(document).on('page:load', function(){
  ready();
  ppoints = Pinpoints();
  remnant_markers = Remnant_markers();
  agenda_info = AgendaInfo();
});
  

