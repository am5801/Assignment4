var basemapUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
  var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

  //map 3 is a rebuild of this leaflet choropleth demo: http://leafletjs.com/examples/choropleth.html

  //initialize map3
  var map1 = L.map('map1', {
    scrollWheelZoom: true
  }).setView([40.739061, -73.952654], 10);

  //CartoDB Basemap
  L.tileLayer(basemapUrl,{
    attribution: attribution
  }).addTo(map1);

  var geojson;

  //this function takes a value and returns a color based on which bucket the value falls between
  function getColor(d) {
      return d > 90 ? '#542788' :
             d > 70 ? '#2166ac' :
             d > 50 ? '#92c5de' :
             d > 30 ? '#f4a582' :
             d > 10 ? '#d7191c' :
                      '#a50f15';
  }

  //this function returns a style object, but dynamically sets fillColor based on the data
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.redi_nor_1),
        weight: 1,
        opacity: 0.5,
        color: '',
        dashArray: '',
        fillOpacity: 0.9
    };
  }

  //this function is set to run when a user mouses over any polygon
  function mouseoverFunction(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#006d2c',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    //update the text in the infowindow with whatever was in the data
    console.log(layer.feature.properties.NTAName);
    $('#infoWindow').text(layer.feature.properties.NTAName+'; REDI Score: '+Math.round(layer.feature.properties.redi_nor_1));

  }

  //this runs on mouseout
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  //this is executed once for each feature in the data, and adds listeners
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: mouseoverFunction,
        mouseout: resetHighlight
        //click: zoomToFeature
    });
  }

  //all of the helper functions are defined and ready to go, so let's get some data and render it!

  //be sure to specify style and onEachFeature options when calling L.geoJson().
  $.getJSON('data/redi.geojson', function(state_data) {
    geojson = L.geoJson(state_data,{
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map1);
  });

  map1.setZoom(13);