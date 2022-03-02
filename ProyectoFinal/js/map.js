/*1. Consumir el siguiente MapServer con datos de EEUU: http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/
2. Centrar la extensión de inicio del mapa.
3. Implementar los widgets de:
a. Leyenda
b. Búsqueda (Search)
c. Galería de mapas base (BaseMapGallery)
d. Vista general (Overview)
e. Barra de escala (ScaleBar)
*/
var map;
var tb;
require([

    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/geometry/Extent",
    "esri/arcgis/utils",
    "esri/dijit/Legend",

    "dojo/on",

    "dijit/TitlePane",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"],
    function (
        Map,
        ArcGISDynamicMapServiceLayer,
        Extent,
        arcgisUtils,
        Legend,
        on

    ) {

        var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/";

        var extentInitial = new Extent({
            /*"xmin": -178.217598382,
            "ymin": 18.921786345999976,
            "xmax": -66.96927110500002,
            "ymax": 71.40623554799998,*/
            "xmin": -130.22,
            "ymin": 18.92,
            "xmax": -25.96,
            "ymax": 76.5,
            "spatialReference": { "wkid": 4326 }
        });



        on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);
        on(dojo.byId("progButtonNode"), "click", fQueryEstados);

        function fPintaYQuery() {
            alert("Evento del botón Seleccionar ciudades");
        }

        function fQueryEstados() {
            alert("Evento del botón Ir a estado");
        }

        mapMain = new Map("map", {
            basemap: "topo",
            extent: extentInitial,
            zoom: 3,
            sliderStyle: "small"
        });

        var lyrUSA = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
            opacity: 0.5
        });
        /* lyrUSA.setVisibleLayers([0, 1, 2, 3]);
            0 Cities
            1 Highways
            2 States
            3 Counties */

        mapMain.addLayers([lyrUSA]);

      

        mapMain.on("load", function (evt) {
        /*
        * Step: update the Legend
        */
            mapMain.resize();
            mapMain.reposition();
            var dijitLegend = new Legend({
                map: mapMain,
                arrangement: Legend.ALIGN_LEFT
            }, "legendDiv");
            dijitLegend.startup();
        });

    });