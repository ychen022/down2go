<script>
$(function(){
    //Create a pusher object to receive real-time data from Pusher Cloud API
    var pusher = new Pusher('<%= Pusher.key %>'); 

    //Subscribe to the cabal's corresponding channel.
    var channel = pusher.subscribe('cabal-' + '<%= @cabal.id %>');

    //Handle receiving a chat message
    channel.bind('chat', function(data) {
        $('.chat-dialog').append(data.username + ': ' + data.content + '<br>');
        $('#chat_area').css("display", "block");
        var $dialog = $('.chat-dialog');
        $dialog.scrollTop($dialog.prop('scrollHeight'));
    });

    //Handle receiving data to add a pinpoint
    channel.bind('pinpoint', function(data) {
        updateAgendaArray(data.id, data.time, data.place, data.latitude, data.longitude);
        rewriteAgenda();
        setTimeout(direction_update_all, 20);
    });

    //Handle receiving data to delete a pinpoint
    channel.bind('delete-pinpoint', function(data){
        removeAgendaItem(data.id);
        removePinFromMap(data.id);
        reassign_marker_icons();
        // Subpar solution. May cause OVER_QUERY_LIMIT
        setTimeout(direction_update_all, 20);
    });

    //Sync with the database to get all the pinppoints.
    $.ajax({
        url:'/cabals/'+<%=@cabal.id%>+'/sync', 
        type: "get"
    })
});
</script>

<script type="text/javascript">
//var image = '<%= image_path("markers/marker.png") %>';

var initialize=function() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(42.3581, -71.063);
    var mapOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    var directionsOptions = {
      suppressMarkers: true,
      preserveViewport: true
    };
    directionsDisplay.setOptions(directionsOptions);
    <% @pinpoints.each do |p| %>
        var place_id = '<%= p.id %>';
    var place_name = '<%= p.place %>';
    var place_latitude = '<%= p.latitude %>'
        var place_longitude = '<%= p.longitude %>'
        var place_time = '<%= p.time %>';
    add_pin(place_name, place_time, place_latitude, place_longitude);
    <% end %>
        console.log("Map initialized");
}

var reassign_marker_icons = function(){
  console.log("starting marker reassignment");
  aInfo = agenda_info.all();
  for (var i=0; i<aInfo.length;i++){
    var ROOT_PATH = '<%= root_url %>';
    var imgpath = ROOT_PATH+"assets/markers/marker"+(i+1)+".png";
    var pm = ppoints.get(aInfo[i].id);
    pm.setIcon(imgpath);
  }
}  

$(function(){
    initialize();
});
</script>
