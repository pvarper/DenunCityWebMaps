// Initialize and add the map
/*global google*/


let map;
let markers = [];
let drawingManager;
var selectedShapeList = [];
var coordenadas= [];

function kruskal(points) {
    // Calcula las distancias entre todos los puntos
    const distances = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const distance = Math.sqrt(Math.pow(points[i][0] - points[j][0], 2) + Math.pow(points[i][1] - points[j][1], 2));
            distances.push([distance, [i, j]]);
        }
    }
    // Ordena las aristas de menor a mayor distancia
    distances.sort((a, b) => a[0] - b[0]);
    // Crea una estructura de conjunto disjunto para encontrar ciclos
    const disjointSet = new DisjointSet(points.length);
    // Array para almacenar las aristas del árbol generador mínimo
    const mst = [];
    // Itera sobre cada arista y comprueba si añadirla al árbol genera un ciclo
    for (let i = 0; i < distances.length; i++) {
        const edge = distances[i][1];
        if (!disjointSet.connected(edge[0], edge[1])) {
            disjointSet.union(edge[0], edge[1]);
            mst.push(edge);
        }
    }
    return mst.map((edge) => [points[edge[0]], points[edge[1]]]);
}

class DisjointSet {
    constructor(size) {
        this.parent = new Array(size);
        this.rank = new Array(size);
        for (let i = 0; i < size; i++) {
            this.parent[i] = i;
            this.rank[i] = 1;
        }
    }
    find(x) {
        if (this.parent[x] === x) return x;
        this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return;
        if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else if (this.rank[rootY] > this.rank[rootX]) {
            this.parent[rootX] = rootY;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
    }
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}
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
            //console.log(event.getPath().getAt(i).toUrlValue(5));
            var coord = event.getPath().getAt(i).toUrlValue(5);
            let arr = coord.split(',')
            var location = new google.maps.LatLng(arr[0], arr[1]);
            const marker = new google.maps.Marker({
                position: location,
                map,
            });
            markers.push(marker);
            const coordi = {

                "lat": parseFloat(arr[0]),
                "lng": parseFloat(arr[1])
            }
            coordenadas.push(coordi);

        };

        // coordenadas = [
        //     { lat: -17.76766, lng: -63.17147},
        //     {lat: -17.7809, lng: -63.16512},
        //     { lat: -17.78417, lng: -63.17413 },
        //     { lat: -17.76619, lng: -63.16736 },
        // ];
        console.log(coordenadas);


        var lista1 = [];
        coordenadas.map(ele => {
            lista1.push([ele.lat,ele.lng])
        })

        var lista2= kruskal(lista1);


        console.log(lista2);
        var lista3 = [];
        lista2.map(ele =>{
            var punto0=ele[0];
            var punto1=ele[1];
            if(lista3.indexOf(ele2 =>punto0[0]==ele2.lat && punto0[1]==ele2.lng) < 0){
                console.log(punto0, lista3);
                lista3.push({lat: punto0[0], lng: punto0[1]});
            }

            if(lista3.indexOf(ele2 =>punto1[0]==ele2.lat && punto1[1]==ele2.lng) < 0){
                console.log(punto0, lista3);
                lista3.push({lat: punto1[0], lng: punto1[1]});
            }
        });
        console.log(lista3);
        event.setPath(lista3);
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