// Initialize and add the map
/*global google*/
let map;
let markers = [];
let drawingManager;
var selectedShapeList = [];


function setSelection(shape) {
     selectedShapeList.push(shape);
}

function deleteSelectedShape() {
    if (selectedShapeList) {
        for (let i = 0; i < selectedShapeList.length; i++) {
            selectedShapeList[i].setMap(null);
        }
    }

}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    markers =[];
}

function deleteMarkers(){
    setMapOnAll(null);
    deleteSelectedShape();
}
function initMap() {
     map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -17.78629, lng: -63.18117 },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

     drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
            ]
        },
        polygonOptions: {
            clickable: true,
            draggable: false,
            editable: false,
            fillColor: "#ADFF2F",
            fillOpacity: 0.5
        }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager,'polygoncomplete',function (event){

            var len= event.getPath().getLength();
            for (var i=0;i<len;i++) {
                console.log(event.getPath().getAt(i).toUrlValue(5));
                var coord = event.getPath().getAt(i).toUrlValue(5);
                let arr = coord.split(',')
                var location = new google.maps.LatLng(arr[0], arr[1]);
                const marker = new google.maps.Marker({
                    position: location,
                    map,
                });
                markers.push(marker);
            }
    })

    google.maps.event.addListener(drawingManager,'overlaycomplete',function (e){
        if (e.type != google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            var newShape = e.overlay;
            newShape.type = e.type;
            google.maps.event.addListener(newShape, 'click', function() {
                setSelection(newShape);
            });
            setSelection(newShape);
        }


    })

    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);
    //Adds a marker at the center of the map.
}



window.initMap = initMap;