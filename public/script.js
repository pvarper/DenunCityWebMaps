// Initialize and add the map
/*global google*/
let map;

let markers = [];
function initMap() {
    // eslint-disable-next-line no-undef
    const santacruz = {lat: -17.78629, lng: -63.18117};
    map = new google.maps.Map(document.getElementById("map"), {
        center: santacruz,
        zoom: 15
    });

    let markersPoligon= new google.maps.MVCArray();
    map.addListener("click", (event) => {
        addMarker(event.latLng);
        console.log(event.latLng.lat(),event.latLng.lng());
        markersPoligon.push(new google.maps.LatLng(event.latLng.lat(),event.latLng.lng()));
        let polygonOptions = {
            path: markersPoligon,
            strokeColor: "#7CFC00",
        };
        let polygon = new google.maps.Polygon(polygonOptions);
        polygon.setMap(map);
    });



    //add event listeners for the buttons
    document
        .getElementById("show-markers")
        .addEventListener("click", showMarkers);
    document
        .getElementById("hide-markers")
        .addEventListener("click", hideMarkers);
    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);
    //Adds a marker at the center of the map.

}

function drawPoligon(){


    let polygon = new google.maps.Polygon({
        paths:  {path: markers},

    });
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

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    hideMarkers();
    markers = [];
}

window.initMap = initMap;