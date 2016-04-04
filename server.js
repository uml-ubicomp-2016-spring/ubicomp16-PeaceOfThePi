var http = require('http');
var fs = require('fs');
// 404 response
function send404Response(response){
  response.writeHead(404, {"Content-Type": "text/plain"});
  response.write("Error 404 : Page not found!! :()");
}

/// Handle a user request
function onRequest(request, response){
  if(request.method == "GET" && request.url == '/'){
    var publicConfig = {
      key: '<YOUR-KEY>',
      stagger_time:       1000, // for elevationPath
      encode_polylines:   false,
      secure:             true, // use https
      proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests
    };
    var gmAPI = new GoogleMapsAPI(publicConfig);

    // or in case you are using Google Maps for Work
    var enterpriseConfig = {
      google_client_id:   '<YOUR-CLIENT-ID>', // to use Google Maps for Work
      google_private_key: '<YOUR-PRIVATE-KEY>', // to use Google Maps for Work
      stagger_time:       1000, // for elevationPath
      encode_polylines:   false,
      secure:             true, // use https
      proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests
    };
    var gmAPI = new GoogleMapsAPI(enterpriseConfig);

    // geocode API
    var geocodeParams = {
      "address":    "121, Curtain Road, EC2A 3AD, London UK",
      "components": "components=country:GB",
      "bounds":     "55,-1|54,1",
      "language":   "en",
      "region":     "uk"
    };

    gmAPI.geocode(geocodeParams, function(err, result){
      console.log(result);
    });

    // reverse geocode API
    var reverseGeocodeParams = {
      "latlng":        "51.1245,-0.0523",
      "result_type":   "postal_code",
      "language":      "en",
      "location_type": "APPROXIMATE"
    };

    gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
      console.log(result);
    });
  }else{
    send404Response(response)
  }

}


http.createServer(onRequest).listen(8888);
console.log("Server is now running");
