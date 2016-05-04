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

function chooseDisplayData() {
  getElements();

  function to24(inpTime, frame) {
    var i = inpTime;
    if (frame == 1) { // Initi
      if (eltData.frameInit == 'PM') {
        i += 12;
        i %= 24;
      }
    } else if (frame == 2) // Fini
      if (eltData.frameFini == 'PM') {
        i += 12;
        i %= 24;
      }

    return i;
  }
  if (eltData.timeInit != 'demoData')
    clearInterval(historyData);
  if (eltData.timeInit == 'demoData' || eltData.timeFini == 'demoData')
    historyData();
  else if (eltData.timeInit == 0 || eltData.timeFini == 0)
  //cellPhoneData(1);
    dummyData2(function() {
    heatmap.setData(testData);
  }, 3)
  else {
    var init = to24(eltData.timeInit, 1);
    var fini = to24(eltData.timeFini, 2);
    console.log(init, fini)
    dummyData(function() {
      heatmap.setData(testData);
    }, 3)
    //cellPhoneData(1, init, fini);
  }

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