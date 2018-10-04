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
