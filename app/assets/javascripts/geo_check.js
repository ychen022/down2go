var geo_check_ready = function() {
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
};

$(document).ready(function(){
  geo_check_ready();
});

$(document).on('page:load', function(){
  geo_check_ready();
});
