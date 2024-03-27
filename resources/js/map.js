const Maps = (function() {
	
	const selectors = {
		body: 'body',
		container: '#map',
	};
	
	const coords = {
		lat: 47.389296,
		lng: 8.524557
	};

  const zoom = 11;

	const	iconMarker = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 148" width="35px" height="53px">',
      '<path d="M17.5,36.55A18.5,18.5,0,1,0,36,18a18.52,18.52,0,0,0-18.5,18.5h0ZM36,1.45a34.63,34.63,0,0,1,29.9,52,364.75,364.75,0,0,0-24.3,51.1,5.89,5.89,0,0,1-5.6,4,6,6,0,0,1-5.6-4A364.75,364.75,0,0,0,6.1,53.45,34.63,34.63,0,0,1,36,1.45h0Z" transform="translate(3.8 25.1)" style="fill:#000"/>',
    '</svg>'
	].join('\n');

	const _initialize = function() {
	    
    const myLatlng = new google.maps.LatLng(coords.lat,coords.lng);
    let mapOptions = {
      center: myLatlng,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
    const styles = [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}];
	    
    let map = new google.maps.Map(document.querySelector('#map'),mapOptions);
    map.setOptions({styles: styles});

    const marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon: {url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(iconMarker)},
    });
	};
	
	return {
		init: _initialize,
	};
})();
		
if (document.querySelector('#map')) {
  Maps.init();
}