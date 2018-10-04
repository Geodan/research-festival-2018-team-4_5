const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: true,
    animation: false,
    timeline: false,
    vrButton: true,
    sceneModePicker: false,
    navigationInstructionsInitiallyVisible: false,
    selectionIndicator: false,
    // imageryProvider: Cesium.createOpenStreetMapImageryProvider({
    //     url: 'https://a.tile.openstreetmap.org/'
    // }),
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity
});

const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: './pctiles',
        debugShowBoundingVolume: false
    })
);
tileset.readyPromise.then(function() {
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
