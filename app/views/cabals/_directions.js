<script type="text/javascript">
// Build and send the request for direction from [start] to [end].
// Calculates the appropriate time the user should leave one agenda item for another, and 
// calls the dom update method.
// start: an item in agenda_info
// end: an item in agenda_info
// car: boolean, whether the cabal has a car
var get_direction=function(start, end, car){
    if (car){
        // If the cabal has a car, check the directions with driving options.
        var request = {
            origin:start.place,
            destination:end.place,
            travelMode:google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            console.log("drive: "+status);
            if (status == google.maps.DirectionsStatus.OK) {
                var dResult = result;
                var leave_at = time_to_utc(end.time)-result.routes[0].legs[0].duration.value;
                update_agenda_with_direction(start, end, dResult, leave_at, "driving");
            }
        });
    }else{
        // If the cabal does not have a car, check the walking/transit directions.
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
                    // If it takes the cabal more than 30 mins to walk to the next place, 
                    // proceed with the direction request with public transit option.
                    directionsService.route(transit_request, function(result, status) {
                        console.log("transit: "+status);
                        var tResult;
                        if (status == google.maps.DirectionsStatus.OK) {
                            tResult = result;
                            if (!tResult.routes[0].legs[0].departure_time){
                                // When the transit request returned a walking instruction, take the walking request response
                                dResult = wresult;
                                leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                                update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                            }else if ((time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value)>tResult.routes[0].legs[0].departure_time.value){
                                // When the latest departure time through transit is earlier than that through walking, take the walking request response
                                dResult = wresult;
                                leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                                update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                            }else{
                                // Otherwise, take the transit request response
                                dResult = tResult;
                                leave_at = tResult.routes[0].legs[0].departure_time.value.getTime()/1000;
                                update_agenda_with_direction(start, end, dResult, leave_at, "public transit");
                            }
                        }else{
                            // If the transit request fails to receive a response (due to free api limit), take the walking request response
                            dResult = wresult;
                            leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                            update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                        }
                    });
                }else{
                    // If it takes less than 30 mins to walk to the next place, just take the walking request response
                    dResult = wresult;
                    leave_at = time_to_utc(end.time)-wresult.routes[0].legs[0].duration.value;
                    update_agenda_with_direction(start, end, dResult, leave_at, "walking");
                }
            }
        });
    }
}

// Clears the previous direction content in the id-related div of [start], and append the new
// direction content to it.
// start: an item in agenda_info
// end: an item in agenda_info
// dResult: response from the direction api
// leave_at: time in seconds when the cabal should leave [start] for [end]
// method: description of the transportation method
var update_agenda_with_direction = function(start, end, dResult, leave_at, method){
    console.log("Updating agenda: "+start.id);
    var vDiv = $('#'+start.id).find('.routeEval');

    //If an evaluation already exiss
    /*
       if (vDiv.find('span.route_info')!=0){ 
       $('span.route_info','#'+start.id).remove();
       }
       */

    if (leave_at<time_to_utc(start.time)){
<<<<<<< HEAD
        // When the latest departure time to reach the next place is earlier than the time the cabal arrives at the
        // current place, display an error message
        vDiv.append('<div class="route_info">\
                You will not make it to the next agenda item in time. <br />\
                The travel time required is '+dResult.routes[0].legs[0].duration.text+' by '+method+'.\
                </div>');
=======
        // Display error message
        vDiv.html('<a class="pop routebad" data-content="Hello!">route evaluation <i class="icon-warning-sign routebad"></i></a>');

        $('.pop').popover({
            'placement': 'top'
        });

        /* 
           <div class="route_info">\
           You will not make it to the next agenda item in time. <br />\
           The travel time required is '+dResult.routes[0].legs[0].duration.text+' by '+method+'.\
           </div>'); */
>>>>>>> 0a57225eee6658cf3d52b13f49bfa7c7b1b72503
        console.log("agenda error appended");
    }else{
        // Otherwise, display the latest departure time
        var nd = new Date(leave_at*1000);

        vDiv.html('<a class="pop routeok" data-content="HELLO">route evaluation <i class="icon-ok routeok"></i></a>');


        $('.pop').popover({
            'placement': 'top'
        });
        /*
           vDiv.html('route evaluation <span class="route_info"><a href="#" data-toggle="popover" data-content="You need to leave for the next agenda item at"><span class="glyphicon glyphicon-remove"></span></a></span>');
        /*
        vDiv.append('<div class="route_info">\
        You need to leave for the next agenda item at '+nd.toLocaleTimeString()+'. <br />\
        The travel time required is '+dResult.routes[0].legs[0].duration.text+' by '+method+'.\
        </div>');
        */
        console.log("agenda notice appended");
    }
    ppoints.add_direction(start.id, dResult);
}

// Calculate the difference in seconds of two time strings in HH:MM AM/PM
var time_difference = function(timea, timeb){
    return time_to_utc(timeb)-time_to_utc(timea);
}

// Converts a time string HH:MM AM/PM to the UTC time in seconds
var time_to_utc = function(tString){
    // Get the hour number
    var hr = parseInt(tString.substring(0,2));
    // Convert the hour number to a 24 hour format.
    if ((tString.substring(6,8)==="PM") && (tString.substring(0,2)!="12")){
        hr+=12;
    }else if((tString.substring(6,8)==="AM") && (tString.substring(0,2)==="12")){
        hr=0;
    }
    // Get the date of the cabal hangout
    var dateStr = $('.cabal-date-hidden').val();
    var dayTime = new Date(dateStr);
    // -19 comes from the datestr causing a 19:00 time. not sure why.
    return ((hr-19)*60+parseInt(tString.substring(3,5)))*60+dayTime.getTime()/1000;
}
// Runs a recursive loop to calculate the directions connecting a certain array with an interval
// between each iteration. Implemented to avoid sending too many requests at once.
// aInfo: the array to loop
// i: the current index looping on
// max: the ending index for the loop in the array
// car: whether the cabal has a car
var direction_loop_delayed = function(aInfo, i, max, car){
    if (i>=max) return;
    setTimeout(function(){
        get_direction(aInfo[i], aInfo[i+1], car);
        if (i<max-1){
            direction_loop_delayed(aInfo, i+1, max, car);
        }
    }, 50);
}

// Calculates all the directions between two connecting agenda items.
var direction_update_all = function(){
    var car=$('#has_car').prop('checked');
    var aInfo = agenda_info.all();
    direction_loop_delayed(aInfo, 0, aInfo.length-1, car);
    for (var i=0;i<aInfo.length-1;i++){
        get_direction(aInfo[i], aInfo[i+1], car);
    }
    // Removes the direction content from the last item in agenda info array.
    var vDiv = $('#'+aInfo[aInfo.length-1].id);
    if (vDiv.children('div.route_info')!=0){
        $('div.route_info','#'+aInfo[aInfo.length-1].id).remove();
    }
}
</script>
