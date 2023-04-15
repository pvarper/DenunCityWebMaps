// Initialize and add the map
/*global google*/
let map;
let drawingManager;
function initMap() {
    // eslint-disable-next-line no-undef

    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: -17.78629, lng: -63.18117},
        zoom: 15
    })


    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions : {
            drawingModes:['marker']
        }
    });
    drawingManager.setMap(map);
    let markers= new google.maps.MVCArray();
    google.maps.event.addListener(drawingManager,'overlaycomplete',function (event){
        if(event.type == 'marker'){
            const position = event.overlay.position;

            console.log(position.lat(),position.lng());
            markers.push(new google.maps.LatLng(position.lat(),position.lng()));

        }
     let polygonOptions = {path: markers};
     let polygon = new google.maps.Polygon(polygonOptions);
     polygon.setMap(map);
    })


}

initMap();