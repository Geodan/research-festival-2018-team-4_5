var origin = Cesium.Cartesian3.fromDegrees(4.941520847558, 52.31402198477, 280.0);
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);

function computeEmitterModelMatrix() {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, new Cesium.HeadingPitchRoll());
    var trs = new Cesium.TranslationRotationScale();
    trs.translation = Cesium.Cartesian3.fromElements(2.5, 4.0, 1.0, new Cesium.Cartesian3());
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
    return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
}

var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
    image : './data/fire.png',
    startScale : 1.0,
    endScale : 4.0,
    particleLife : 1.0,
    speed : 5.0,
    imageSize : new Cesium.Cartesian2(20, 20),
    emissionRate : 5.0,
    lifetime : 16.0,
    modelMatrix : modelMatrix,
    emitter: new Cesium.SphereEmitter(5.0)
    //emitterModelMatrix : computeEmitterModelMatrix()
}));


