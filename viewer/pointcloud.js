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

