var agenda_info=new Array();
var pins={};
var geocoder;
var map;

var ready;
ready = function() {
  $(".pinpoint-time").change(function(){
    var $time_field = $(".pinpoint-time-hidden");
    var $time_field_am = $(".pinpoint-time-am");
    var time = $(this).val() + " " + $time_field_am.val();
    $time_field.val(time);
  });

  $(".pinpoint-time-am").change(function(){
    var $time_field = $(".pinpoint-time-hidden");
    var $time_field_raw = $(".pinpoint-time");
    var time = $time_field_raw.val() + " " + $(this).val();
    $time_field.val(time);
  });

  $('#gochat').click(function(){
    var $chat_area = $('#chat_area');
    if($chat_area.css("display") == "none"){
      $chat_area.css("display", "block");
    } else {
      $chat_area.css("display", "none");
    }
  });

  $('#gomembers').click(function(){
    var $member_area = $('#member_area');
    if($member_area.css("display") == "none"){
      $member_area.css("display", "block");
    } else {
      $member_area.css("display", "none");
    }
  });
};

$(document).ready(ready);
$(document).on('page:load', ready);

