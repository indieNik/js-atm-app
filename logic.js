var lat = 15.3598;
var long = 73.9418;
var pos = {};
var pyrmont;
var sortedArr = [];

function getLocation() {
  if (navigator.geolocation) {
    if(autocomplete) {
      var place = autocomplete.getPlace();
      if(place && place.geometry) {
        var coords = {};
        coords.latitude = place.geometry.location.lat();
        coords.longitude = place.geometry.location.lng();
        pos.coords = coords;
        showPosition(pos);
      } else {
        alert("Please select a valid option from the autocomplete dropdown to proceed!");
      }
    } else {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
getLocation();

function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  pyrmont = { lat: lat, lng: long };

  map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 15
  });
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: pyrmont,
      radius: 2000,
      type: ["atm"]
    },
    callback
  );
}

var map;
var infowindow;

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    //					icon: 'img/atm.png',
    animation: google.maps.Animation.DROP,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(
      '<div class="balloon__label"><h4 class="text-primary" id="place_name">' +
        place.name +
        '</h4><p id="open_status" class="label label-success"></p><br><br><p>Near <b>' +
          place.vicinity +
          "</b></p><a href='https://maps.google.com/maps?saddr=" + pyrmont.lat + "," + pyrmont.lng + "&daddr=" + placeLoc.lat() + "," + placeLoc.lng() + "' target='_blank' class='map-view-link'><b>View on Google Maps</b></a></div>"
    );
    if (place.opening_hours) {
      if (place.opening_hours.open_now) $("#open_status").html("Open Now");
      else {
        $("#open_status").html("Closed Now");
        $("#open_status")
          .removeClass("label-success")
          .addClass("label-danger");
      }
    } else {
      $("#open_status").html("Not Sure if it's Open");
      $("#open_status")
        .removeClass("label-success")
        .addClass("label-warning");
    }
    // Load the Info Window
    infowindow.open(map, this);
  });
  $(".results").append(
      '<div class="result__card"><h4 class="text-primary" id="place_name">' +
        place.name +
        '</h4><p>Near <b>' +
        place.vicinity +
        "</b></p><a href='https://maps.google.com/maps?saddr=" + pyrmont.lat + "," + pyrmont.lng + "&daddr=" + placeLoc.lat() + "," + placeLoc.lng() + "' target='_blank' class='map-view-link'><b>View on Google Maps</b></a></div>"
    );
}

function searchPlace() {
  getLocation();
}

// Setting up auto-complete
var map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: -33.8688, lng: 151.2195 },
  zoom: 13
});
// var card = document.getElementById("pac-card");
var input = document.getElementById("pac-input");
// var types = document.getElementById("type-selector");
// var strictBounds = document.getElementById("strict-bounds-selector");

// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

var autocomplete = new google.maps.places.Autocomplete(input);

// Bind the map's bounds (viewport) property to the autocomplete object,
// so that the autocomplete requests use the current map bounds for the
// bounds option in the request.
autocomplete.bindTo("bounds", map);

// Set the data fields to return when the user selects a place.
autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

var infowindow = new google.maps.InfoWindow();
var infowindowContent = document.getElementById("infowindow-content");
infowindow.setContent(infowindowContent);
var marker = new google.maps.Marker({
  map: map,
  anchorPoint: new google.maps.Point(0, -29)
});

autocomplete.addListener("place_changed", function() {
  // infowindow.close();
  // marker.setVisible(false);
  var place = autocomplete.getPlace();
  if (!place.geometry) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'");
    return;
  }

  // If the place has a geometry, then present it on a map.
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17); // Why 17? Because it looks good.
  }
});

$(".search-btn").click(() => {
  // console.log("Clicked!");
  $(".sidebar").toggleClass("active");
  $(".sidebar").hasClass("active") ? 
    event.target.innerHTML = "Close" :
    event.target.innerHTML = "Search ATMs in another Location";
})

$("#map").click(() => {
  // console.log("Map Clicked!");
  $(".sidebar").removeClass("active");
  $(".sidebar").hasClass("active") ? 
    $(".search-btn").html("Close"):
    $(".search-btn").html("Search ATMs in another Location");
  // $(".gm-style-iw-a").toggle();
  // $(".gm-style-iw-a").css('opacity', '0.5');
  
})


$(".toggle-results").click(() => {
  // console.log("toggle-results Clicked!");
  $(".results").toggleClass("active");
  $(".results").hasClass("active") ? 
    event.target.innerHTML = "Hide List View" :
    event.target.innerHTML = "Show List View";
})

