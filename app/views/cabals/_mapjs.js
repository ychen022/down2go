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
    directionsService = new google.maps.DirectionsService();
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
    nodeContent.innerHTML = id+", "+place+", "+time;
    contentNode.appendChild(nodeContent);
    google.maps.event.addListener(marker, 'click', function(){
        if (infowindowopen) infowindowopen.close();
        infowindowopen = new google.maps.InfoWindow({
            content: contentNode
        });
        infowindowopen.open(map, marker);
    });
    ppoints.add(id, marker);
    //pins[id] =  marker;

    console.log("Pin added");
}

var get_direction=function(start, end, car){
    if (car){
        var request = {
            origin:start.place,
            destination:end.place,
            travelMode:google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            console.log("drive: "+status);
            if (status == google.maps.DirectionsStatus.OK) {
                //directionsDisplay.setDirections(result);
                var dResult = result;
                var leave_at = time_to_utc(end.time)-result.routes[0].legs[0].duration.value;
                update_agenda_with_direction(start, end, dResult, leave_at);
            }
        });
    }else{
        var endtime = new Date(time_to_utc(end.time)*1000);
        var transit_request = {
            origin:start.place,
            destination:end.place,
            travelMode:google.maps.TravelMode.TRANSIT,
            transitOptions: {arrivalTime:endtime}
        };
        var walk_request = {
            origin:start.place,
            destination:end.place,
            travelMode:google.maps.TravelMode.WALKING
        };
        // Get the walking request result first, then check the duration of the trip.
        // If the trip is over [30 mins] by walking, attempt to check for transit.
        directionsService.route(walk_request, function(wresult, wstatus) {
            console.log("walk: "+wstatus);
            var leave_at;
            if (wstatus == google.maps.DirectionsStatus.OK) {
                if (wresult.routes[0].legs[0].duration.value>1800){
                    directionsService.route(transit_request, function(result, status) {
                        console.log("transit: "+status);
                        var tResult;
                        if (status == google.maps.DirectionsStatus.OK) {
                            //directionsDisplay.setDirections(result);
                            tResult = result;
                            if (!tResult.routes[0].legs[0].departure_time){
                                console.log("ENTRY A");
                                dResult = wresult;
                                leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                                update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                            }else if ((time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value)>tResult.routes[0].legs[0].departure_time.value){
                                console.log("ENTRY B "+time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value);
                                dResult = wresult;
                                leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                                update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                            }else{
                                console.log("ENTRY C "+tResult.routes[0].legs[0].departure_time.value);
                                dResult = tResult;
                                leave_at = tResult.routes[0].legs[0].departure_time.value.getTime()/1000;
                                update_agenda_with_direction(start, end, dResult, leave_at, "public transit");
                            }
                        }else{
                            console.log("ENTRY E");
                            dResult = wresult;
                            leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                            update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                        }
                    });
                }else{
                    console.log("ENTRY F");
                    dResult = wresult;
                    leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                    update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                }
            }
        });
    }
}

var update_agenda_with_direction = function(start, end, dResult, leave_at, method){
    console.log("Updating agenda: "+start.id);
    var vDiv = $('#'+start.id);
    if (vDiv.children('div.route_info')!=0){
        $('div.route_info','#'+start.id).remove();
    }
    if (leave_at<time_to_utc(start.time)){
        // Display error message
        vDiv.append('<div class="route_info">\
                You will not make it to the next agenda item in time. <br />\
                The travel time required is '+dResult.routes[0].legs[0].duration.text+' by '+method+'.\
                </div>');
        console.log("agenda error appended");
    }else{
        // Display ideal departure time
        var nd = new Date(leave_at*1000);
        vDiv.append('<div class="route_info">\
                You need to leave for the next agenda item at '+nd.toLocaleTimeString()+'. <br />\
                The travel time required is '+dResult.routes[0].legs[0].duration.text+' by '+method+'.\
                </div>');
        console.log("agenda notice appended");
    }
}

// Calculate the difference in seconds of two time strings in HH:MM AM/PM
var time_difference = function(timea, timeb){
    return time_to_utc(timeb)-time_to_utc(timea);
}

// Converts a time string HH:MM AM/PM to the UTC time in seconds
var time_to_utc = function(tString){
    var hr = parseInt(tString.substring(0,2));
    if ((tString.substring(6,8)==="PM") && (tString.substring(0,2)!="12")){
        hr+=12;
    }else if((tString.substring(6,8)==="AM") && (tString.substring(0,2)==="12")){
        hr=0;
    }
    var dateStr = $('.cabal-date-hidden').val();
    var dayTime = new Date(dateStr);
    // -19 comes from the datestr causing a 19:00 time. not sure why.
    return ((hr-19)*60+parseInt(tString.substring(3,5)))*60+dayTime.getTime()/1000;
}

// Experimental
var direction_with_timeout = function(start, end, car) {
    setTimeout(function(){
        get_direction(start, end, car); 
    }, 200);
}

// Experimental
var direction_loop_delayed = function(aInfo, i, max, car){
    if (i>=max) return;
    setTimeout(function(){
        get_direction(aInfo[i], aInfo[i+1], car);
        if (i<max-1){
            direction_loop_delayed(aInfo, i+1, max, car);
        }
    }, 50);
}

var direction_update_all = function(){
    var car=$('#has_car').prop('checked');
    var aInfo = agenda_info.all();
    direction_loop_delayed(aInfo, 0, aInfo.length-1, car);
    //for (var i=0;i<aInfo.length-1;i++){
    //  get_direction(aInfo[i], aInfo[i+1], car);
    //}
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
        $('#findonmapDIV').hide();
        $('#addtoagendaDIV').show();
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
