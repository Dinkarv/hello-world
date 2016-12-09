	//Declaring global variables for map and marker display..
	var map;
	var markers = [];
	var styles = [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ];
		  
		  
	//Function to initialize map..
	function initMap(){
	map = new google.maps.Map(document.getElementById('map'),{
	center: {lat: 30.73776, lng: 76.783288},
	zoom: 13,
	styles: styles,
	mapTypeControl: false
	});

	//Declaring the arrays of locations..
	var loc = [
	{title: 'Rose Garden', cord: {lat: 30.7461,lng: 76.7820}},
	{title: 'Rock Garden', cord: {lat: 30.7525, lng:  76.8101}},
	{title: 'Chandigarh Museum', cord: {lat: 30.7489,lng: 76.7875}},
	{title: 'Indian Coffee House', cord: {lat: 30.7405,lng: 76.7805}},
	{title: 'Elante Mall', cord: {lat: 30.7056,lng: 76.8013}},
	{title: 'PGI', cord: {lat:  30.7624,lng: 76.7763 }},
	{title: 'Sukhna Lake', cord: {lat: 30.7333304 ,lng: 76.8166634}},
	];
	//information window of marker and bounds to set..
	var infowindow = new google.maps.InfoWindow();

	var defaultIcon = makeMarkerIcon("0091ff");
	var highlightedIcon = makeMarkerIcon("FFFF24");
	
	//loop to fetch information of locations markers
	for(var i=0; i < loc.length; i++){
	var cord = loc[i].cord;
	var title = loc[i].title;
	var marker = new google.maps.Marker({
		position: cord,
		title: title,
		icon: defaultIcon,
		animation: google.maps.Animation.DROP,
		id: i
	});
	markers.push(marker);
	//function of clicking the marker..
	marker.addListener('click',function(){
	populateInfoWindow(this, infowindow);
	});
	
	marker.addListener('mouseover', function(){
	this.setIcon(highlightedIcon);
	});
	marker.addListener('mouseout',function(){
	this.setIcon(defaultIcon);
	});
	}
	
	document.getElementById('show-listings').addEventListener('click', showListings);
	document.getElementById('hide-listings').addEventListener('click', hideListings);
	}
	
	
	function makeMarkerIcon(markerColor){
		var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
		new google.maps.Size(21,34),
		new google.maps.Point(0,0),
		new google.maps.Point(10,34),
		new google.maps.Size(21,34));
		return markerImage;
		}
		
	function showListings(){
		var bounds = new google.maps.LatLngBounds();

		for(var i=0; i< markers.length; i++){
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
		}
		map.fitBounds(bounds);
	}
	
	function hideListings(){
	for(var i=0; i < markers.length; i++){
	markers[i].setMap(null);
	}
	}
	
	//function to display information window of marker..
	function populateInfoWindow(marker, infowindow){
	if(infowindow.marker!= marker){
	infowindow.marker = marker;
	infowindow.setContent('<div>' + marker.title + '</div>');
	infowindow.open(map,marker);
	infowindow.addListener('closeclick',function(){
	infowindow.setMarker(null);
	});
	var streetViewService = new google.maps.StreetViewService();
	var radius = 50;
	/*
	function getStreetView(data, status){
	if(status == google.maps.StreetViewStatus.OK) {
		var nearStreetViewLocation = data.location.latlng;
		var heading = google.maps.geometry.spherical.computeHeading(
		nearStreetViewLocation, marker.position);
		infowindow.setContent('<div>'+ marker.title + '</div><div id="pano"></div>');
		var panoramaOptions = {
		                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
}

streetViewService.getPanaromaByLocation(marker.position, radius, getStreetView);
infowindow.open(map, marker);
*/
}
}

 function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
//function to alert the user that map is not available or key is wrong
      function googleError(){
        alert("Map is unable to load ");
    };
	
	
	var viewmodel = {
		obname = ko.observableArray(['Rose Garden','Rock Garden','Chandigarh Museum', 'Indian Coffee House', 'Elante Mall', 'PGI','Sukhna Lake' ]),
		obname1 = ['Rose Garden','Rock Garden','Chandigarh Museum', 'Indian Coffee House', 'Elante Mall', 'PGI','Sukhna Lake' ],
		
		wikiinfo = ko.observable(''),
		
		getwikiinfo = function(data){
			var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + data + '&format=json&callback=wikiCallback';
			 var wikiRequestTimeout = setTimeout(function(){
        alert("failed to get wikipedia resources");
   }, 8000);
		
		$.ajax(wikiUrl,{
			dataType: "jsonp",
			success: function(response){
				var articleList = response[2];
				viewmodel.wikiinfo(articleList[0]);
				clearTimeout(wikiRequestTimeout);
			}
		});
		},
	  showDetails : function(data){
    var click = 0;
  var largeInfo = new google.maps.InfoWindow();
     for(var j = 0 ; j < markers.length ; j++){
      markers[j].setAnimation(null);
      if(markers[j].title === data){
        click = j;
        populateInfoWindow(markers[j],largeInfo);
        viewmodel.getWikiInfo(markers[j].title);
        markers[j].setAnimation(google.maps.Animation.BOUNCE);
        }
      }
      setTimeout(function(){
             markers[click].setAnimation(null);
      },2000);
},

//num variable to store response from input
 query : ko.observable(''),

//Filter function to filter the list and markers on map
 search : function(value) {

// preparing regular expression by concatinating with experssions
    var num = "^"+value+".*$";

//Converting num variable into regular expression
    var re = new RegExp(num,'i');
    viewmodel.obname.removeAll();
//Refining results
    for(var i = 0 ; i < viewmodel.obname1.length ; i++){
      if(viewmodel.obname1[i].match(re)) {
        viewmodel.obname.push(viewmodel.obname1[i]);
        markers[i].setVisible(true);
      }
      else{
        markers[i].setVisible(false);
      }
    }
  }
};
		
viewmodel.query.subscribe(viewmodel.search);
//Binding values for knockout library
ko.applyBindings(viewmodel);
