// map center
var myLatlng = new google.map.LatLng(42.6550831, -71.3266345);
// map options,
var testData = {
  max: 10,
  data: []
};
var myOptions = {
  zoom: 3,
  center: myLatlng
};

// standard map
map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

// heatmap layer
heatmap = new HeatmapOverlay(map, {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  "radius": 3,
  "maxOpacity": 1,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries 
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'decibel'
});

/*
Here bgins the customization for the smaller sample sized cellPhoneData
Since it is very localized, the points displayed to the map are smaller,
and the map becomes more personal as well, as it zooms into the users 
current location.
@params:
 reloadAppData: Bool (Does the user want to pull data from DB anew?)
 timeInit: Int(Time to log the data from(Start))
 timeFini: Int(Time to end data logging(End))
 heatRadius:Float (Each Heat Dot's display radius)  
*/
//var phoneData = httpGet2("http://10.253.95.190:3000/soundLocation/");
function cellPhoneData(reloadAppData, timieInit, timeFini, heatRadius) {
  //Setup the Cell Phone Data Map
  // Emtpy out the data set, allows new population
  testData.data = [];
  // Set the zoom on the map to a more intimate zoom level
  map.setZoom(18);

  //TODO: Get current Location Data, center on the user.

  //Set the radius to the users preset, base level is .0001
  if (heatRadius)
    heatmap.radius = heatRadius;
  else
    heatmap.radius = 0.0001;

  if (reloadAppData)
    phoneData = httpGet2("http://10.253.95.190:3000/soundLocation/");

  // Scrape for the data from the Database generated JSON Object
  for (i = 0; i < Object.keys(phoneData).length; i++) {
    var lat = phoneData[i].X_coordinate;
    var lng = phoneData[i].Y_coordinate;
    var decibel = decibelToValue(phoneData[i].Decibel);
    testData.data.push({
      'lat': lat,
      'lng': lng,
      'decibel': decibel
    });
  }
  heatmap.setData(testData);
}

/*
 Populates the map with Dummy Data, Cycle through produces time shift data.
 @params:
  cycleThrough: Bool (Does the user want to produce a simulated time heatmap?)
  callback: Function (Callback function, displays heatdata on the map)  
*/
function dummyData(cycleThrough, callback) {
  // Clear out the data in the map currently.
  testData.data = [];
  // String for the apprehension of, am I in the middle of the ocean.
  var baseGeocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
  var i = 0;
  mapBound = 0;
  while (true) {
    // Produce random data points, and random sound levels for the data points.
    var lat = rangeRandom(18, 48);
    var lng = rangeRandom(62, 125, 1);
    var decibel = rangeRandom(0, 8);
    lat += Math.random();
    lng += Math.random();
    i++;
    mapBound++;
    // TODO: Make this function asynchronously get called, and update properly.
    httpGetAsync(baseGeocode + String(lat) + ',' + String(lng) + "&key=AIzaSyA0k_uFGU8696noGaVsVQDTs12nBSzNScc",
      function(addMe) {
        // console.log(i);
        if (!addMe) {
          //console.log(i);
          i--;
        } else {
          testData.data.push({
            'lat': lat,
            'lng': lng,
            'decibel': decibel
          });
        }

      });
    console.log(mapBound);
    if (i === 200 || mapBound == 200) { // Dataset completely filled, display the heatmap overlay.
      callback();
      break;
    }
    //console.log(baseGeocode + String(lat) + ',' + String(lng))
  }
}
// Random number in a range generator
function rangeRandom(min, max, neg) {
  var ret = Math.random() * 1000 % max;

  if (ret < min) {
    ret = Math.random() * 1000 % ((max - min) + 1) + min;
  }
  // All values are negative, or if choice DNE 1, negative values as wanted.
  if (neg)
    if (neg == 1)
      ret *= -1;
    else {
      if (Math.round(Math.random()))
        ret *= -1;
    }
    // Always return a full number.
  return Math.round(ret);
}

// Conversion of decibel values to human safe zones
function decibelToValue(decVal) {
  var toMe = 0;
  var ret = 0;
  // Anyting below 20 is roughly silent. range 0-2
  if (decVal <= 10)
    return 0;
  if (decVal < 100)
    toMe = Math.round((decVal - decVal % 10) / 10);

  switch (toMe) {
    case 1:
      ret = 1;
      break;
    case 2:
      ret = 2;
      break;
    case 3:
      ret = 3;
      break;
    case 4:
      ret = 4;
      break;
    case 5:
      ret = 5;
      break;
    case 6:
      ret = 6; // Noise level becomes somewhat annoying
      break;
    case 7:
      ret = 7;
      break;
    case 8:
      ret = 8 // Loud room noise level
      break;
    case 9:
      ret = 9;
      break;
    default: // Anything past 100, for sustained periods could cause hearing damage.
      ret = 10;
      break;
  }
  return ret;
}

/*
 Used to get the bounds, and make sure not to draw in the Ocean.
 @params:
  theUrl: The geolocation to check address of.
*/
function httpGet(theUrl) {
  var ret = true;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);

  // If this is ZERO_RESULT then you are in the middle of nowhere. Don't log it.
  if (JSON.parse(xmlHttp.responseText).status == 'ZERO_RESULTS') {
    ret = false;
  }
  return ret;
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      if (JSON.parse(xmlHttp.responseText).status == 'ZERO_RESULTS') {
        callback(false);

      } else
        callback(true);
  }
  xmlHttp.open("GET", theUrl, false); // true for asynchronous 
  xmlHttp.send(null);
}
// Getter for the data located in the internal database.
function httpGet2(theUrl) {
  var ret = true;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText)
}

function getNewLatLng() {
  var lat, lng;
  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
  });
  return new google.maps.LatLng(lat, lng);
}
dummyData(0, function() {
  heatmap.setData(testData)
})
//cellPhoneData();
//httpGet("https://maps.googleapis.com/maps/api/geocode/json?latlng=47.478940,%20-43.619716")
//heatmap.setData(testData);