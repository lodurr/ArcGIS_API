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
    "esri/dijit/Legend",
    "esri/dijit/Search",
    "esri/dijit/BasemapGallery",
    "esri/dijit/OverviewMap",
    "esri/dijit/Scalebar",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/layers/FeatureLayer",
    "esri/graphic",
    "esri/toolbars/draw",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/tasks/query",

    "dojo/on",
    "dojo/dom-construct",
    "dojo/_base/Color",


    "dijit/TitlePane",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"],
    function (
        Map,
        ArcGISDynamicMapServiceLayer,
        Extent,
        Legend,
        Search,
        BasemapGallery,
        OverviewMap,
        Scalebar,
        Popup,
        PopupTemplate,
        FeatureLayer,
        Graphic,
        Draw,
        SimpleLineSymbol,
        SimpleFillSymbol,
        SimpleMarkerSymbol,
        Query,

        on,
        domConstruct,
        Color

    ) {

        var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/";

        on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);
        on(dojo.byId("progButtonNode"), "click", fQueryEstados);

        /*
        * Drawing Tool
        */
        function fPintaYQuery() {
            //alert("Evento del botón Seleccionar ciudades");

            var tbDraw = new Draw(mapMain);
            tbDraw.on("draw-end", displayPolygon);
            tbDraw.activate(Draw.POLYGON);

        }
        /*
        * Drawing Tool  -- Display Polygon
        */
        function displayPolygon(evt) {

            // Get the geometry from the event object
            var geometryInput = evt.geometry;

            // Define symbol for finished polygon
            var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

            // Clear the map's graphics layer
            mapMain.graphics.clear();

            /*
             * Step: Construct and add the polygon graphic
             */
            var graphicPolygon = new Graphic(geometryInput, tbDrawSymbol);
            mapMain.graphics.add(graphicPolygon);

            selectCities(geometryInput);
        }

        function selectCities(geometryInput) {

            // Define symbol for selected features (using JSON syntax for improved readability!)
            var symbolSelected = new SimpleMarkerSymbol({
                "type": "esriSMS",
                "style": "esriSMSCircle",
                "color": [255, 115, 0, 128],
                "size": 6,
                "outline": {
                    "color": [255, 0, 0, 214],
                    "width": 1
                }
            });
            var queryQuakes = new Query();
            queryQuakes.geometry = geometryInput;

            lyrCities.setSelectionSymbol(symbolSelected);

            lyrCities.selectFeatures(queryQuakes,FeatureLayer.SELECTION_NEW);
        }



        /*
        * Go to State
        */
        function fQueryEstados() {
            // alert("Evento del botón Ir a estado");

        }


        /*
        * Extent
        */
        var extentInitial = new Extent({
            "xmin": -130.22,
            "ymin": 70.92,
            "xmax": -25.96,
            "ymax": 76.5,
            "spatialReference": { "wkid": 4326 }
        });

        /*
        * PopUp
        */
        var popup = new Popup({
        }, domConstruct.create("div"));

        var template = new PopupTemplate({
            title: "Estado de {STATE_NAME}, {STATE_ABBR}",
            fieldInfos: [
                { fieldName: "POP2000", visible: true, label: "Población año 2000: " },
                { fieldName: "POP00_SQMI", visible: true, label: "Población por sqmi: " },
                { fieldName: "ss6.gdb.States.area", visible: true, label: "Area por sqmi: " }
            ]
        });

        /*
        * MapMain
        */
        mapMain = new Map("map", {
            basemap: "topo",
            extent: extentInitial,
            zoom: 3,
            sliderStyle: "small",
            infoWindow: popup
        });

        /*
        * Mapserver
        */
        var lyrUSA = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
            opacity: 0.5
        });
        lyrUSA.setVisibleLayers([1, 3]);
        /*    0 Cities
            1 Highways
            2 States
            3 Counties */

        /*
        * Feature Layer
        */
        var lyrStates = new FeatureLayer(sUrlUSAService + "/2", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            infoTemplate: template
        });
        var lyrCities = new FeatureLayer(sUrlUSAService + "/0", {
        });

        mapMain.addLayers([lyrUSA, lyrStates, lyrCities]);

        /*
        * Search widget
        */
        var dijitSearch = new Search({
            map: mapMain,
            autoComplete: true
        }, "divSearch");
        dijitSearch.startup();

        /*
        * BaseMapGallery
        */
        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: mapMain
        }, "basemapGallery");
        basemapGallery.startup();

        /*
        * Overview Map
        */
        var overviewMapDijit = new OverviewMap({
            map: mapMain,
            attachTo: "bottom-left",
            height: 250,
            width: 250,
            visible: false
        });
        overviewMapDijit.startup();

        /*
        * Collapse button GalleryMap
        */

        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }

        /*
        * Scalebar
        */
        var scalebar = new Scalebar({
            map: mapMain,
            attachTo: "bottom-right"

        });
        scalebar.show();


        /*
        * Load Map and Legend
        */
        mapMain.on("load", function (evt) {
            //createToolbar();
            mapMain.resize();
            mapMain.reposition();
            var dijitLegend = new Legend({
                map: mapMain,
                arrangement: Legend.ALIGN_LEFT
            }, "legendDiv");
            dijitLegend.startup();
        });

    });