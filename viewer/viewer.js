imagery = {
    ortho2016wms: new Cesium.WebMapServiceImageryProvider({
        url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?',
        layers: '2016_ortho25'
    }),
    ortho2017wms: new Cesium.WebMapServiceImageryProvider({
        url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?',
        layers: '2017_ortho25'
    }),
    ortho2016wmts: new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts?',
        layer: '2016_ortho25',
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'EPSG:3857',
        tileMatrixLabels: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19'
        ],
        maximumLevel: 19
        // credit : new Cesium.Credit('PDOK')
    }),
    ortho2017wmts: new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts?',
        layer: '2017_ortho25',
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'EPSG:3857',
        tileMatrixLabels: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19'
        ],
        maximumLevel: 19
        // credit : new Cesium.Credit('PDOK')
    }),
    BRT: new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts?',
        layer: 'brtachtergrondkaart',
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'EPSG:3857',
        tileMatrixLabels: [
            'EPSG:3857:0',
            'EPSG:3857:1',
            'EPSG:3857:2',
            'EPSG:3857:3',
            'EPSG:3857:4',
            'EPSG:3857:5',
            'EPSG:3857:6',
            'EPSG:3857:7',
            'EPSG:3857:8',
            'EPSG:3857:9',
            'EPSG:3857:10',
            'EPSG:3857:11',
            'EPSG:3857:12',
            'EPSG:3857:13',
            'EPSG:3857:14',
            'EPSG:3857:15',
            'EPSG:3857:16',
            'EPSG:3857:17',
            'EPSG:3857:18',
            'EPSG:3857:19'
        ],
        maximumLevel: 19
        // credit : new Cesium.Credit('PDOK')
    }),
    OSM: Cesium.createOpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
    }),
    viewModels: [
        new Cesium.ProviderViewModel({
            name: 'PDOK Luchtfoto 2016',
            iconUrl: Cesium.buildModuleUrl(
                'Widgets/Images/ImageryProviders/bingAerial.png'
            ),
            tooltip: 'PDOK Luchtfoto 2016 25cm',
            creationFunction: function() {
                return imagery.ortho2016wms;
            }
        }),
        new Cesium.ProviderViewModel({
            name: 'PDOK Luchtfoto 2017',
            iconUrl: Cesium.buildModuleUrl(
                'Widgets/Images/ImageryProviders/bingAerial.png'
            ),
            tooltip: 'PDOK Luchtfoto 2017 25cm',
            creationFunction: function() {
                return imagery.ortho2017wms;
            }
        }),
        new Cesium.ProviderViewModel({
            name: 'BRT',
            iconUrl: Cesium.buildModuleUrl(
                'Widgets/Images/ImageryProviders/openStreetMap.png'
            ),
            tooltip: 'Basis Registratie Topografie',
            creationFunction: function() {
                return imagery.BRT;
            }
        }),
        new Cesium.ProviderViewModel({
            name: 'OSM',
            iconUrl: Cesium.buildModuleUrl(
                'Widgets/Images/ImageryProviders/openStreetMap.png'
            ),
            tooltip: 'OpenStreetMap',
            creationFunction: function() {
                return imagery.OSM;
            }
        })
    ]
};

const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider:  Cesium.createOpenStreetMapImageryProvider({
        url : 'https://a.tile.openstreetmap.org/'
    }),
    baseLayerPicker: true,
    animation: false,
    timeline: false,
    vrButton: true,
    sceneModePicker: false,
    navigationInstructionsInitiallyVisible: false,
    selectionIndicator: false,
    imageryProvider: false,
    imageryProviderViewModels: imagery.viewModels,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity
});


const homeView = {
    x: 3893307.38,
    y: 336636.24,
    z: 5024885.55
};
viewer.camera.setView({ destination: homeView });
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(
    commandInfo
) {
    viewer.camera.setView({ destination: homeView });
    commandInfo.cancel = true;
});

const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: './pctiles/tileset.json',
        debugShowBoundingVolume: false
    })
);
tileset.style = new Cesium.Cesium3DTileStyle({
            pointSize: 2
});

tileset.readyPromise.then(function() {
    console.log('Loaded tileset');
    var bounding = tileset._root._boundingVolume;
    var center = bounding.boundingSphere.center;
    var cart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(center);

    var dest = Cesium.Cartesian3.fromDegrees(
        cart.longitude * (180 / Math.PI),
        cart.latitude * (180 / Math.PI),
        bounding._boundingSphere.radius * 2
    );
    viewer.camera.setView({ destination: dest });
});
