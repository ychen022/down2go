// TODO change those global variables to more secure implementations.
var agenda_info;
var ppoints;
var remnant_markers;
var geocoder;
var map;
var directionsService;
var directionsDisplay;
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

  $(document).on('click', '.agendaitem', function(){
    var id = $(this).attr("id");
    ppoints.toggleInfoWindow(id);
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
  

