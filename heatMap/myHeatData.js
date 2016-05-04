var connectingIP = "10.253.95.130";
var key = "&key=AIzaSyA0k_uFGU8696noGaVsVQDTs12nBSzNScc";
var heatmap = {};
// map center
var myLatlng = new google.maps.LatLng(42.6550831, -71.3266345);
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
// Creates a new heatmap object allows for easier accessing of the data points
// heatmap layer
heatmap = new HeatmapOverlay(map, {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  "radius": 4,
  "maxOpacity": 1,
  // scales the raius based on map zoom
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
timeInit -> timeFini: Time log to display the data from.
heatRadius:Float (Each Heat Dot's display radius)
*/
var phoneData = httpGet2("http://" + connectingIP + ":3000/soundLocation/");

function cellPhoneData(reloadAppData, timeInit, timeFini, heatRadius) {
  //Setup the Cell Phone Data Map
  // Emtpy out the data set, allows new population
  testData.data = [];
  // Set the zoom on the map to a more intimate zoom level
  map.setZoom(18);
  var newCenter = new google.maps.LatLng(42.6550831, -71.3266345);
  // Set center to the school center.
  map.setCenter(newCenter);
  //Set the radius to the users preset, base level is .0001
  if (heatRadius)
    radius = heatRadius;
  else
    radius = 0.0005
    //  newHeatMap(radius);

  if (reloadAppData)
    phoneData = httpGet2("http://" + connectingIP + ":3000/soundLocation/");
  if (!(timeInit && timeFini)) {
    timeInit = -1;
    timeFini = 1000;
  }
  var _getTime = function(_time) {
      console.log(_time);
      var l = _time.match(/([0-9]{1,2}).+([AP]M)/);
      var q = Number(l[1]);
      if (l[2] == 'PM') {
        q += 12;
        q %= 24;
      }
      return q;
    }
    // Scrape for the data from the Database generated JSON Object
  for (i = 0; i < Object.keys(phoneData).length; i++) {
    var lat = phoneData[i].X_coordinate;
    var lng = phoneData[i].Y_coordinate;
    var decibel = rangeRandom(0, 10) //decibelToValue(phoneData[i].Decibel);
    var time = phoneData[i].Time.match(/([0-9]{1,2}):/)[1];
    console.log(time);
    if (time >= timeInit && time <= timeFini)
      testData.data.push({
        'lat': lat,
        'lng': lng,
        'decibel': decibel
      });
  }
  heatmap.setData(testData);
}
//cellPhoneData();
/*
Populates the map with Dummy Data, Cycle through produces time shift data.
@params:
cycleThrough: Bool (Does the user want to produce a simulated time heatmap?)
callback: Function (Callback function, displays heatdata on the map)
*/
function dummyData(callback, _radius) {
  if (_radius)
    radius = _radius;
  else
    radius = 4;
  //newHeatMap(radius);
  var newCenter = new google.maps.LatLng(39.5, -98.35);
  // Center for the contiguos United States.
  map.setCenter(newCenter);
  map.setZoom(4)
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
    lat += Number(Math.random().toFixed(1));
    lng += Number(Math.random().toFixed(1));
    i++;
    mapBound++;
    httpGetAsync(baseGeocode + String(lat) + ',' + String(lng) + key,
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
    // Done, so as not to generate to much GeoLocation Queries.
    if (i === 2500 || mapBound == 2500) { // Dataset completely filled, display the heatmap overlay.
      callback();
      conole.log(testData.data.length, testData.data)
      break;
    }
  }
}
// Random number in a range generator
function rangeRandom(min, max, neg) {
  var ret = Math.random() * 1000 % max;
  if (ret < min) {
    ret = Math.random() * 1000 % ((max - min) + 1) + min;
  }
  //Conversion to negative if wanted
  if (neg)
    if (neg == 1)
      ret *= -1;
    else { // Randomly select to convert to negative value
      if (Math.round(Math.random()))
        ret *= -1;
    }
    // Always return a full number.
  return Math.round(ret);
}
// Conversion of decibel values to useable values for display
function decibelToValue(decVal) {
  // Ranges based on internet scale. 6 ~ classroom.
  var toMe = 0;
  var ret = 0;
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
// Asynchronous manner of getting the data, this one works better.
function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      if (JSON.parse(xmlHttp.responseText).status == 'ZERO_RESULTS') {
        callback(false, JSON.parse(xmlHttp.responseText));
      } else
        callback(true, JSON.parse(xmlHttp.responseText));
  }
  xmlHttp.open("GET", theUrl, false); // true for asynchronous
  xmlHttp.send(null);
}
// Getter for the data located in the internal database's JSON file.
function httpGet2(theUrl) {
  var ret = true;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText)
}
// Consistently get the same locations, and push the data forward from there.
function dummyData2(callback, _radius) {
  if (_radius)
    radius = _radius;
  else
    radius = 1.4;
  //newHeatMap(radius)
  var newCenter = new google.maps.LatLng(39.5, -98.35);
  // Center for the contiguos United States.
  map.setCenter(newCenter);
  map.setZoom(4)
  //newHeatMap(radius);
  // This can't be brought into it's own file, cause of weird dependencies.
  var l = "40.6643N 73.9385W 34.0194N 118.4108W 41.8376N 87.6818W 29.7805N 95.3863W 40.0094N 75.1333W 33.5722N 112.0880W 29.4724N 98.5251W 32.8153N 117.1350W 32.7757N 96.7967W 37.2969N 121.8193W 30.3072N 97.7560W 30.3370N 81.6613W 37.7751N 122.4193W 39.7767N 86.1459W 39.9848N 82.9850W 32.7795N 97.3463W 35.2087N 80.8307W 42.3830N 83.1022W 31.8484N 106.4270W 47.6205N 122.3509W 39.7618N 104.8806W 38.9041N 77.0171W 35.1035N 89.9785W 42.3320N 71.0202W 36.1718N 86.7850W 39.3002N 76.6105W 35.4671N 97.5137W 45.5370N 122.6500W 36.2277N 115.2640W 38.1781N 85.6667W 43.0633N 87.9667W 35.1056N 106.6474W 32.1543N 110.8711W 36.7827N 119.7945W 38.5666N 121.4686W 33.8091N 118.1553W 39.1252N 94.5511W 33.4019N 111.7174W 33.7629N 84.4227W 36.7793N 76.0240W 41.2647N 96.0419W 38.8673N 104.7607W 35.8302N 78.6414W 25.7752N 80.2086W 37.7699N 122.2256W 44.9633N 93.2683W 36.1279N 95.9023W 41.4781N 81.6795W 37.6907N 97.3427W 30.0686N 89.9390W 32.7007N 97.1247W 35.3212N 119.0183W 27.9701N 82.4797W 39.7082N 104.8235W 21.3259N 157.8453W 33.8555N 117.7601W 33.7365N 117.8826W 27.7543N 97.1734W 33.9381N 117.3932W 38.6357N 90.2446W 38.0402N 84.4584W 40.4398N 79.9766W 37.9763N 121.3133W 61.2176N 149.8953W 39.1399N 84.5064W 44.9489N 93.1039W 36.0965N 79.8271W 41.6641N 83.5819W 40.7242N 74.1726W 33.0508N 96.7479W 36.0122N 115.0375W 40.8090N 96.6804W 28.4159N 81.2988W 40.7114N 74.0648W 32.6277N 117.0152W 42.8925N 78.8597W 41.0882N 85.1439W 33.2829N 111.8549W 27.7620N 82.6441W 27.5477N 99.4869W 35.9810N 78.9056W 33.6784N 117.7713W 43.0878N 89.4301W 36.9230N 76.2446W 33.5665N 101.8867W 33.3102N 111.7422W 36.1033N 80.2606W 33.5331N 112.1899W 39.4745N 119.7765W 25.8699N 80.3029W 32.9098N 96.6304W 36.6794N 76.3018W 32.8577N 96.9700W 36.2830N 115.0893W 33.6687N 111.8237W 30.4485N 91.1259W 37.4944N 121.9411W 37.5314N 77.4760W 43.5985N 116.2311W 34.1393N 117.2953W 33.5274N 86.7990W 47.6736N 117.4166W 43.1699N 77.6169W 37.6609N 120.9891W 41.5739N 93.6167W 34.2023N 119.2046W 47.2522N 122.4598W 34.1088N 117.4627W 35.0851N 78.9803W 33.9233N 117.2057W 32.5102N 84.8749W 33.6906N 118.0093W 40.9459N 73.8674W 32.3463N 86.2686W 41.7635N 88.2901W 34.1814N 118.2458W 32.4670N 93.7927W 41.0805N 81.5214W 34.7254N 92.3586W 35.1978N 101.8287W 33.3655N 82.0734W 30.6684N 88.1002W 42.9612N 85.6556W 40.7785N 111.9314W 34.7843N 86.5390W 30.4551N 84.2534W 32.6842N 97.0210W 38.8890N 94.6906W 35.9709N 83.9465W 26.0183N 97.4538W 42.2695N 71.8078W 37.0760N 76.5217W 34.4049N 118.5047W 41.8231N 71.4188W 26.1413N 80.1439W 33.7788N 117.9605W 33.2246N 117.3062W 34.1233N 117.5642W 38.4468N 122.7061W 27.2810N 80.3838W 35.0665N 85.2471W 33.3884N 111.9318W 32.3158N 90.2128W 26.6431N 81.9973W 45.6372N 122.5965W 34.0395N 117.6088W 43.5383N 96.7320W 33.7877N 112.3111W 37.1942N 93.2913W 26.0212N 80.3404W 38.4144N 121.3849W 44.9237N 123.0231W 33.8624N 117.5639W 34.6936N 118.1753W 44.0567N 123.1162W 34.5913N 118.1090W 33.2012N 96.6680W 36.6902N 121.6337W 40.5482N 105.0648W 35.7821N 78.8141W 37.6281N 122.1063W 42.1155N 72.5400W 29.6583N 95.1505W 32.505N 83.396W 34.0586N 117.7613W 38.8183N 77.0820W 33.1336N 117.0732W 37.3858N 122.0263W 39.6989N 105.1176W 39.1225N 94.7418W 42.2634N 89.0628W 33.8350N 118.3414W 26.0311N 80.1646W 41.5181N 88.1584W 41.1874N 73.1957W 36.5664N 87.3452W 40.9147N 74.1628W 41.7492N 88.1620W 33.1510N 96.8193W 32.7639N 96.5924W 32.0025N 81.1536W 43.0410N 76.1436W 39.7774N 84.1996W 34.1606N 118.1396W 33.8048N 117.8249W 33.8857N 117.9280W 26.2185N 98.2461W 31.0777N 97.7320W 37.0480N 76.2971W 47.5978N 122.1565W 42.4929N 83.0250W 25.9770N 80.3358W 40.6885N 112.0118W 38.8843N 94.8188W 34.0298N 80.8966W 42.5812N 83.0303W 39.9180N 104.9454W 41.3108N 72.9250W 31.5601N 97.1860W 32.8179N 79.9589W 34.1933N 118.8742W 36.3272N 119.3234W 41.9670N 91.6778W 40.6663N 74.1935W 38.7657N 121.3032W 29.6788N 82.3459W 32.9884N 96.8998W 41.0799N 73.5460W 33.2151N 97.1417W 32.0299N 102.1097W 26.2708N 80.2593W 37.9722N 122.0016W 39.0362N 95.6948W 34.2669N 118.7485W 33.6706N 112.4527W 30.2116N 92.0314W 47.3853N 122.2169W 41.7660N 72.6833W 37.3646N 121.9679W 34.5277N 117.3536W 32.4545N 99.7381W 35.8522N 86.4161W 37.9877N 87.5347W 38.1079N 122.2639W 33.9496N 83.3701W 40.5940N 75.4782W 37.8667N 122.2991W 35.22N 97.44W 42.2756N 83.7313W 30.0843N 94.1458W 39.0853N 94.3513W 38.9479N 92.3261W 39.7639N 89.6708W 34.0746N 118.0291W 46.8652N 96.8290W 40.7523N 89.6171W 40.2453N 111.6448W 42.7098N 84.5562W 31.8804N 102.3434W 33.9382N 118.1309W 34.2092N 77.8858W 39.8097N 105.1066W 33.6659N 117.9123W 30.5237N 97.6674W 33.1239N 117.2828W 25.9489N 80.2436W 39.8822N 105.0644W 33.9561N 118.3443W 44.0154N 92.4772W 38.2568N 122.0397W 42.0396N 88.3217W 40.6023N 112.0010W 27.9795N 82.7663W 42.9847N 71.4439W 42.6389N 71.3221W 45.5023N 122.4416W 42.3760N 71.1183W 34.2681N 119.2550W 33.5019N 117.1246W 41.5585N 73.0367W 37.9775N 121.7976W 45.7895N 108.5499W 35.9855N 79.9902W 32.9723N 96.7081W 37.9530N 122.3594W 34.0559N 117.9099W 38.2731N 104.6124W 33.5719N 117.1907W 39.5906N 104.8691W 33.9069N 118.0834W 32.8853N 80.0169W 48.0033N 122.1742W 26.2426N 80.1290W 37.7009N 122.4650W 27.9856N 80.6626W 34.1890N 118.3249W 33.9067N 98.5259W 40.0175N 105.2797W 44.5207N 87.9842W 36.0365N 95.7810W 26.7483N 80.1266W 30.6013N 96.3144W 29.5544N 95.2958W 34.9332N 120.4438W 32.8017N 116.9605W 37.5542N 122.3131W 33.0383N 97.0061W 34.1118N 117.3883W 41.5541N 90.6040W 28.0411N 81.9589W 36.4931N 119.4211W 40.5040N 74.3494W 33.5615N 84.227W 32.35N 95.30W 32.3197N 106.7653W 41.6769N 86.2690W 40.5608N 74.2926W 18.4064N 66.0640W 18.3801N 66.1633W 18.4121N 65.9798W 17.9874N 66.6097W 18.2324N 66.0390W 36.08073N 115.1368W 38.880N 77.183W 36.1785N 115.0490W 36.0987N 115.2619W 29.9978N 90.1779W 34.0315N 118.1686W 36.0182N 115.2154W 27.9360N 82.2993W"
  p = l.match(/([0-9.]+)(N|S) ([0-9.]+)(E|W)/g);
  testData.data = []
  var k = "61.3850,-152.2683 32.7990,-86.8073 34.9513,-92.3809 14.2417,-170.7197 33.7712,-111.3877 36.1700,-119.7462 39.0646,-105.3272 41.5834,-72.7622 38.8964,-77.0262 39.3498,-75.5148 27.8333,-81.7170 32.9866,-83.6487 21.1098,-157.5311 42.0046,-93.2140 44.2394,-114.5103 40.3363,-89.0022 39.8647,-86.2604 38.5111,-96.8005 37.6690,-84.6514 31.1801,-91.8749 42.2373,-71.5314 39.0724,-76.7902 44.6074,-69.3977 43.3504,-84.5603 45.7326,-93.9196 38.4623,-92.3020 14.8058,145.5505 32.7673,-89.6812 46.9048,-110.3261 35.6411,-79.8431 47.5362,-99.7930 41.1289,-98.2883 43.4108,-71.5653 40.3140,-74.5089 34.8375,-106.2371 38.4199,-117.1219 42.1497,-74.9384 40.3736,-82.7755 35.5376,-96.9247 44.5672,-122.1269 40.5773,-77.2640 18.2766,-66.3350 41.6772,-71.5101 33.8191,-80.9066 44.2853,-99.4632 35.7449,-86.7489 31.1060,-97.6475 40.1135,-111.8535 37.7680,-78.2057 18.0001,-64.8199 44.0407,-72.7093 47.3917,-121.5708 44.2563,-89.6385 38.4680,-80.9696 42.7475,-107.2085"
  q = k.match(/([-0-9,.]{3,}),([-0-9,.]{3,})/g);
  // Log of all the states lat's and long's
  for (var i = 0; i < q.length; i++) {
    a = q[i].match(/([-0-9.]+),/)
    s = q[i].match(/,([-0-9.]+)/)
    var lat = Number(a[1]);
    var lng = Number(s[1]);
    var decibel = rangeRandom(8, 10);
    testData.data.push({
      'lat': lat,
      'lng': lng,
      'decibel': decibel
    })
  }
  // Data from most populous cities in the US
  for (var i = 0; i < p.length; i++) {
    q = p[i].match(/([0-9.]+)(N|S)/);
    w = p[i].match(/([0-9.]+)(E|W)/);
    var lat = Number(q[1]) * posNeg(q[2]);
    var lng = Number(w[1]) * posNeg(w[2]);
    var decibel = rangeRandom(0, 3);
    testData.data.push({
      'lat': lat,
      'lng': lng,
      'decibel': decibel
    })
  }
  // Just standard Push of the data pool's negative .
  function posNeg(_char) {
    if (_char == 'S' || _char == 'W')
      return -1;
    return 1;
  }
  callback()
}

//Populates a lat, lng quadrant with dummyData. Sooo much dummy data
function populateArea(init, fini, callback) {
  // Attempt to fill in the whole .5 above, and below with dummy data
  // This is not elegant, it's just to show purpose.
  var x = Number(init.toFixed(3)) + 0.250;
  var y = Number(fini.toFixed(3)) + 0.250;
  // alert(x)
  for (var i = 0; i < 0.500; i += 0.005) {
    for (var k = 0; k < 0.500; k += 0.005) {
      var decibel = rangeRandom(0, 3);
      var lat = x + i;
      var lng = y + k;
      testData.data.push({
        'lat': lat,
        'lng': lng,
        'decibel': decibel
      });
      lat = x - i;
      lng = y - k;
      decibel = rangeRandom(0, 3);
      testData.data.push({
        'lat': lat,
        'lng': lng,
        'decibel': decibel
      });
    }
  }
  callback()
}