let sensors = [
	{
        center: [4.94239332622488803, 52.31455666106409552],
        id: 0,name: ""
	},{
        center: [4.94196556724617242, 52.31507302752397237],
        id: 1,name: "A"
	},{
        center: [4.94085243097757765, 52.31473143594956099],
        id: 2,name: "B"
	},{
        center: [4.94173897186654631, 52.31369882621372369],
        id: 3,name: "C"
	},{
        center: [4.94282830597800427, 52.31409259292723846],
        id: 4, name: "D"
    }
];

sensors.forEach(s=>{
    //var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(4.941772, 52.314306);
    var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(s.center[0], s.center[1]);
    var modelMatrix = Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
        new Cesium.Cartesian3(0.0, 0.0, 120), new Cesium.Matrix4()
    );

    
    var heading = Cesium.Math.toRadians(0 + Math.random()*20);
    var pitch = 0;
    var roll = 0;
    var origin = Cesium.Cartesian3.fromDegrees(s.center[0], s.center[1], 110.0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var transform = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);

    var box = new Cesium.BoxGeometry({
        vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
        maximum : new Cesium.Cartesian3(1.0, 15.0, 1.0),
        minimum : new Cesium.Cartesian3(-1.0, -15.0, -1.0)
    });
    var geometry = Cesium.BoxGeometry.createGeometry(box);
    var sphereInstance = new Cesium.GeometryInstance({
        geometry : geometry,
        modelMatrix : transform,
        attributes : {
            color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id: 'sphere'
    });
    let primitive = new Cesium.Primitive({
        geometryInstances : sphereInstance,
        appearance : new Cesium.PerInstanceColorAppearance({
            translucent : false,
            closed : true
        })
    });
    s.primitive = primitive;
    viewer.scene.primitives.add(primitive);
    
});

client = new Paho.MQTT.Client('136.144.137.130', 9001, 'smurf');

function onConnect() {
    console.log('Connected to websocket');
    client.subscribe('dakdata');
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log(
            'Connection with websocket lost:' + responseObject.errorMessage
        );
    }
}

function changeColor(idx, value){    
    var attributes = sensors[idx].primitive.getGeometryInstanceAttributes('sphere');
    var ratio = value / 50;
    var brightBlue = Cesium.Color.BLUE.brighten(1-ratio, new Cesium.Color());
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(brightBlue);
}

function changeDir(idx, value){    
    /*
    var attributes = sensors[idx].primitive.getGeometryInstanceAttributes('sphere');
    var ratio = value / 50;
    var brightBlue = Cesium.Color.BLUE.brighten(1-ratio, new Cesium.Color());
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(brightBlue);
    */
}

function onMessageArrived(message) {
    //console.log('Message recieved from websocket:' + message.payloadString);

    const data = JSON.parse(message.payloadString);
    const value = parseFloat(data.SensorValue.replace('+', ''));
    if (data.SensorId == 'DATA000') {
        changeColor(0,value);
    }
    if (data.SensorId == 'DATA005') {
        changeColor(1,value);
    }
    if (data.SensorId == 'DATA010') {
        changeColor(2,value);
    }
    if (data.SensorId == 'DATA015') {
        changeColor(3,value);
    }
    if (data.SensorId == 'DATA020') {
        changeColor(4,value);
    }
    
    if (data.SensorId == 'DATA002') {
        changeDir(0,value);
    }
    if (data.SensorId == 'DATA007') {
        changeDir(1,value);
    }
    if (data.SensorId == 'DATA012') {
        changeDir(2,value);
    }
    if (data.SensorId == 'DATA017') {
        changeDir(3,value);
    }
    if (data.SensorId == 'DATA022') {
        changeDir(4,value);
    }
    
    //console.log(value);
}

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({ onSuccess: onConnect });
