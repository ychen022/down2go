<script type="text/javascript">
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
    for (var i=0;i<aInfo.length-1;i++){
      get_direction(aInfo[i], aInfo[i+1], car);
    }
}
</script>