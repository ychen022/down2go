<script>
$(function(){
    var pusher = new Pusher('<%= Pusher.key %>'); 
    var channel = pusher.subscribe('cabal-' + '<%= @cabal.id %>');
    Pusher.log = function(message) {
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    };
    channel.bind('chat', function(data) {
        $('.chat-dialog').append(data.username + ': ' + data.content + '<br>');
        $('#chat_area').css("display", "block");
        var $dialog = $('.chat-dialog');
        $dialog.scrollTop($dialog.prop('scrollHeight'));
    });
    channel.bind('pinpoint', function(data) {
        updateAgendaArray(data.id, data.time, data.place, data.latitude, data.longitude);
        // Ideally the next line should be used that involves at most 2 direction api calls.
        //updateAgendaWithDirection(data.id, data.time, data.place);
        rewriteAgenda();
        // Subpar solution. May cause OVER_QUERY_LIMIT
        setTimeout(direction_update_all, 20);
    });
    channel.bind('delete-pinpoint', function(data){
        removeAgendaItem(data.id);
        removePinFromMap(data.id);
        reassign_marker_icons();
        // Subpar solution. May cause OVER_QUERY_LIMIT
        setTimeout(direction_update_all, 20);
    });
    $.ajax({
        url:'/cabals/'+<%=@cabal.id%>+'/sync', 
        type: "get"
    })
});
</script>

<script type="text/javascript">
var image = '<%= image_path("markers/marker.png") %>';

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

var infowindowopen;

var add_pin=function(id, place, time, latitude, longitude) {
    console.log("Adding pin");

    var Latlng = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        map: map,
        position: Latlng,
        icon: image,
        title: place
    });
    var contentNode = document.createElement("div");
    contentNode.className = "infowindow_content";
    // Replace with desired string or dom element for the marker
    var nodeContent = document.createElement("p");
    nodeContent.innerHTML = place+", "+time;
    contentNode.appendChild(nodeContent);


    marker.infowindow = new google.maps.InfoWindow({
      content: contentNode
    });
    
    ppoints.add(id, marker);
    reassign_marker_icons();
    google.maps.event.addListener(marker, 'click', function(){
      ppoints.toggleInfoWindow(id);
    });
    //pins[id] =  marker;

    console.log("Pin added");
}

var reassign_marker_icons = function(){
  console.log("starting marker reassignment");
  aInfo = agenda_info.all();
  for (var i=0; i<aInfo.length;i++){
    var ROOT_PATH = '<%= root_url %>';
    var imgpath = ROOT_PATH+"assets/markers/marker"+(i+1)+".png"
    var pm = ppoints.get(aInfo[i].id);
    pm.setIcon(imgpath);
  }
}  

$(function(){
    initialize();

    var check_on_map = function(){
        remnant_markers.clear();
        var address = document.getElementById('address').value;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var loc = results[0].geometry.location;
                map.setCenter(loc);
                var marker = new google.maps.Marker({
                    map: map,
                    position: loc
                });
                remnant_markers.add_marker(marker);
                $( "input[name='pinpoint[place]']" ).val(address);
                $( "input[name='pinpoint[latitude]']" ).val(loc.pb);
                $( "input[name='pinpoint[longitude]']" ).val(loc.qb);
                $('#searchErrorsDIV').html('');
            } else {
                $('#addtoagendaDIV').hide();
                $('#findonmapDIV').show();
                $('#searchErrorsDIV').html('<div class="searchErrors">GeoSearch failed. Did you enter a valid location?</div>');
//                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        $('#findonmapDIV').hide();
        $('#addtoagendaDIV').show();
    };

    $('#address').keypress(function(evt){
        var charCode = (evt.which) ? evt.which : window.event.keyCode; 
        if (charCode == 13){ 
            event.preventDefault();
            check_on_map();
        } 
    });

    $('#check-on-map').click(function(){
        check_on_map();  
    });

    $('#check_agenda').click(function(){
        direction_update_all();
    });

    $('.agenda-addbtn').click(function(){
        $('#addtoagendaDIV').hide();
        $('#findonmapDIV').show();
    });

    $('#backToFind').click(function(){
        $('#addtoagendaDIV').hide();
        $('#findonmapDIV').show();
    });

});
</script>
