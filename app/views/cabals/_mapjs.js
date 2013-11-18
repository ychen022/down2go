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
    });
    channel.bind('pinpoint', function(data) {
        updateAgendaArray(data.id, data.time, data.place);
        rewriteAgenda();
    });
    channel.bind('delete-pinpoint', function(data){
        removeAgendaItem(data.id);
        removePinFromMap(data.id);
    });
    $.ajax({
        url:'/cabals/'+<%=@cabal.id%>+'/sync', 
        type: "get"
    })
});
</script>



<script type="text/javascript">
var image = '<%= image_path("pin.png") %>';

var initialize=function() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(42.3581, -71.063);
    var mapOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    <% @pinpoints.each do |p| %>
        var place_id = '<%= p.id %>';
    var place_name = '<%= p.place %>';
    var place_time = '<%= p.time %>';
    add_pin(place_name, place_time);
    <% end %>
        console.log("Map initialized");
}

var add_pin=function(id, place, time) {
    console.log("Adding pin");
    geocoder.geocode( { 'address': place}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: image,
                title: place
            });
            pins[id] =  marker;
        }
    });
    console.log("Pin added");
}



$(function(){
    initialize();
    $('#check-on-map').click(function(){
        var address = document.getElementById('address').value;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
});
</script>
