/*
var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url : './data/Amsterdam-Arena-2014.v3.gltf',
	debugWireframe: true,
	debugShowBoundingVolume : true
}));
*/

var origin = Cesium.Cartesian3.fromDegrees(4.941520847558, 52.31402198477, 200.0);
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);

var heading = Cesium.Math.toRadians(90);
var pitch = 0;
var roll = 0;
var origin = Cesium.Cartesian3.fromDegrees(4.941520847558, 52.31402198477, 240.0);
var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
var transform = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);

var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
  url : './data/Amsterdam-Arena-2014.glb',
  modelMatrix : transform,
  scale : 1.0,                     // double size
}));
