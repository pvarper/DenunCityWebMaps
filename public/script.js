// Initialize and add the map
/*global google*/
let map;

let markers = [];
let markersPoligon;
let polygon;


function initMap() {
    // eslint-disable-next-line no-undef
    const santacruz = {lat: -17.78629, lng: -63.18117};
    map = new google.maps.Map(document.getElementById("map"), {
        center: santacruz,
        zoom: 15
    });

     markersPoligon= new google.maps.MVCArray();
    map.addListener("click", (event) => {
        markersPoligon.push(new google.maps.LatLng(event.latLng.lat(),event.latLng.lng()));
        addMarker(event.latLng);
        drawPoligon();
    });


    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);
    //Adds a marker at the center of the map.

}



function drawPoligon(){
    let polygonOptions = {
        path: markersPoligon,
        strokeColor: "#7CFC00",
    };
    polygon = new google.maps.Polygon(polygonOptions);
    polygon.setMap(map);

}
const imgicon = "/img/green.png";
function addMarker(position) {
    const marker = new google.maps.Marker({
        position,
        icon: imgicon,
        map,
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}


// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];

}

window.initMap = initMap;