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



