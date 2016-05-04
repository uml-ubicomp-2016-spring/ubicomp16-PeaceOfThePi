// map center
var myLatlng = new google.maps.LatLng(42.6547246, -71.326617);
// map options,
var testData = {
  max: 8,
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


var phoneData = httpGet2("http://192.168.29.212:3000/soundLocation/");

function cellPhoneData(reloadAppData, timieInit, timeFini) {
  testData.data = [];
  if (reloadAppData)
    phoneData = httpGet2("http://192.168.29.212:3000/soundLocation/");
  for (i = 0; i < 20; i++) {
    var lat = phoneData[i].X_coordinate;
    var lng = phoneData[i].Y_coordinate;
    var decibel = decibelToValue(phoneData[i].Decibel);
    testData.data.push({
      'lat': lat,
      'lng': lng,
      'decibel': decibel
    });
  }
  console.log(phoneData);
  //  heatmap.setData(testData);
}
cellPhoneData();

// Populates the map with Dummy Data, Cycle through produces time shift data.
function dummyData(cycleThrough, callback) {
  // Clear out the data in the map currently.
  testData.data = [];
  var baseGeocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
  for (var i = 0; i < 100; i++) {
    var lat = rangeRandom(18, 48, 0);
    var lng = rangeRandom(21, 125, 1);
    var decibel = rangeRandom(0, 9);
    lat += Math.random();
    lng += Math.random();
    //"Breaking" Due to the non Asyncness of this function call, runs too fast...FIXIT
    if (httpGet(baseGeocode + String(lat) + ',' + String(lng)) + "&key=AIzaSyA0k_uFGU8696noGaVsVQDTs12nBSzNScc") {
      testData.data.push({
        'lat': lat,
        'lng': lng,
        'decibel': decibel
      });
      console.log(baseGeocode + String(lat) + ',' + String(lng))
    } else
      i--; // Decrement the index if the value isoutside the range 
  }
  callback();
}

function rangeRandom(min, max, neg) {
  var ret = Math.random() * 1000 % max;

  if (ret < min) {
    ret = Math.random() * 1000 % ((max - min) + 1) + min;
  }
  if (neg)
    if (neg == 1)
      ret *= -1;
    else
  if (Math.random() * 2)
    ret *= -1;

  return Math.round(ret);
}

function decibelToValue(decVal) {
  var toMe = 0;
  var ret = 0;

  if (decVal <= 10)
    return 0;
  if (decVal < 100)
    toMe = Math.round((decVal - decVal % 10) / 10);

  switch (toMe) {
    case 1:
    case 2:
      ret = 1;
      break;
    case 3:
      ret = 2;
      break;
    case 4:
    case 5:
      ret = 3;
      break;
    case 6:
      ret = 4;
      break;
    case 7:
      ret = 5;
      break;
    case 8:
      ret = 6
      break;
    case 9:
      ret = 7;
      break;
    default:
      ret = 8;
      break;
  }
  return ret;
}

// Used to get the bounds, and make sure not to draw in the Ocean.
function httpGet(theUrl) {
  var ret = true;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  // If this is NO_RESULT then you are in the middle of nowhere. Don't log it.
  if (JSON.parse(xmlHttp.responseText).status == 'ZERO_RESULTS') {
    ret = false;
  }
  return ret;
}

function httpGet2(theUrl) {
  var ret = true;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  // If this is NO_RESULT then you are in the middle of nowhere. Don't log it.
  return JSON.parse(xmlHttp.responseText)
}

dummyData(0, function() {
  heatmap.setData(testData)
})
//httpGet("https://maps.googleapis.com/maps/api/geocode/json?latlng=47.478940,%20-43.619716")
//heatmap.setData(testData);