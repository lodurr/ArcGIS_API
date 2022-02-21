var mapMain;

// @formatter:off
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Scalebar",
    "esri/dijit/Legend",
    "dojo/dom",
    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"],
    function (Map, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, BasemapToggle, Scalebar, Legend, dom, ready, parser, on,
        BorderContainer, ContentPane) {
        // @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            /*
             * Step: Specify the initial extent
             * Note: Exact coordinates may vary slightly from snippet/solution
             * Reference: https://developers.arcgis.com/javascript/jssamples/fl_any_projection.html
             */
            var extentInitial = new Extent({
                "xmin": -14521585.856836917,
                "ymin": 3563149.775533272,
                "xmax": -12503648.310108801,
                "ymax": 5331596.861938639,
                "spatialReference": { "wkid": 102100, "latestWkid": 3857 }
            });

            // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "satellite",
                extent: extentInitial
            });

            /*
             * Step: Add the USA map service to the map
             */
            var lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity: 0.5
            });


            /*
             * Step: Add the earthquakes layer to the map
             */
            var lyrQuakes = new FeatureLayer("https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0");
            lyrQuakes.setDefinitionExpression("MAGNITUDE  >= 2.0");

            /*
            * Step: Revise code to use the addLayers() method
            */
            mapMain.addLayers([lyrUSA, lyrQuakes]);

            /*
             * Step: Add the BaseMapToggle widget to the map
             */
            var toggle = new BasemapToggle({
                map: mapMain,
                basemap: "topo"
            }, "BasemapToggle");
            toggle.startup();

            /*
             * Step: Add a legend once all layers have been added to the map
             */

            var dijitScalebar = new Scalebar({
                map: mapMain,
                scalebarUnit: "dual",
                attachTo: "bottom-left"
            });
            mapMain.on("layers-add-result", function() {
                var dijitLegend = new Legend({
                    map: mapMain,
                    arrangement: Legend.ALIGN_RIGHT
                }, "divLegend");
                dijitLegend.startup();
            }); // stub
            


        });
    });
