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

    "dojo/on",
    "dojo/dom-construct",

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

        on,
        domConstruct

    ) {

        var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/";
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
            titleInBody: false
        }, domConstruct.create("div"));

        var template = new PopupTemplate({
            title: "{STATE_NAME}",
            description: "{STATE_NAME}:  {POP2000} {POP00_SQMI} {area} of starters finished",
            fieldInfos: [
                { fieldName: "POP2000", visible: true, label: "Average Household Size: " },
                { fieldName: "STATE_NAME", visible: true, label: "State: " }
              ]
        });

        on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);
        on(dojo.byId("progButtonNode"), "click", fQueryEstados);

        function fPintaYQuery() {
            alert("Evento del botón Seleccionar ciudades");
        }

        function fQueryEstados() {
            alert("Evento del botón Ir a estado");
        }

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
        lyrUSA.setVisibleLayers([0, 1, 3]);
        /*    0 Cities
            1 Highways
            2 States
            3 Counties */

        var featureLayer = new FeatureLayer(sUrlUSAService + "/2", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            infoTemplate: template
        });


        mapMain.addLayers([lyrUSA, featureLayer]);

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
            mapMain.resize();
            mapMain.reposition();
            var dijitLegend = new Legend({
                map: mapMain,
                arrangement: Legend.ALIGN_LEFT
            }, "legendDiv");
            dijitLegend.startup();
        });

    });