// File for all calls to the myHeatData API
// Attain all the elements selecteable from html file
var eltData = {};

function getElements() {
  var elt = document.getElementById('timeInit');
  eltData.timeInit = elt.options[elt.selectedIndex].value;

  elt = document.getElementById('timeFini');
  eltData.timeFini = elt.options[elt.selectedIndex].value;

  elt = document.getElementById('frameInit');
  eltData.frameInit = elt.options[elt.selectedIndex].value;

  elt = document.getElementById('frameFini');
  eltData.frameFini = elt.options[elt.selectedIndex].value;

  eltData.location = document.getElementById('location').value;
  if (eltData.frameFini < eltData.frameInit) // Swap them, for coherence sake.
    eltData.frameFini, eltData.frameInit = eltData.frameInit, eltData.frameFini;
}

//Displays the interval simulated heatmap data to the user.Demo point at start begins.
dummyData2(function() {
  heatmap.setData(testData);
}, 3)
var historyData = setInterval(function() {
  dummyData2(function() {
    heatmap.setData(testData);
  }, 3)
}, 3000)

historyData();

function chooseDisplayData() {
  getElements();
  if (eltData.timeInit != 'demoData')
    clearInterval(historyData);
  console.log(eltData.timeInit)
}

function goToLocation() {
  getElements();
  console.log(eltData.location)
  if (eltData.location) {
    clearInterval(historyData); // Stop the history Data update loop.
    testData.data = []
    heatmap.setData(testData);
    var searchFor = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + eltData.location + '&key=AIzaSyA0k_uFGU8696noGaVsVQDTs12nBSzNScc';
    httpGetAsync(searchFor, function(resp, data) {
      q = data.results[0].geometry.location
      map.setCenter(new google.maps.LatLng(q.lat, q.lng));
      map.setZoom(12)
      populateArea(q.lat, q.lng, function() {
        heatmap.setData(testData);
      });
    })
  }
}
document.getElementById('submit').onclick = function() {
  console.log("Fi")
}