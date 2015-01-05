(function(){
    var deviceList = document.getElementById("deviceList");
    
    self.port.on("removedevice",(device) => removeDevice(device));
    
    self.port.on("updatedevice",(device) => {
        removeDevice(device);
        addDevice(device);
    });
    
    self.port.on("newdevice", (device) => addDevice(device));
    
    function removeDevice(device){
        document.getElementById(device.address).remove();
    }
    
    function addDevice(device){
        var deviceDiv = document.createElement("div");
        deviceDiv.id = device.address;

        var icon = document.createElement("img");
        icon.className = "icon";
        icon.src = device.icon.url;
        deviceDiv.appendChild(icon);

        var name = document.createElement("div");
        name.className = "deviceName";
        name.innerHTML = device.name;
        deviceDiv.appendChild(name);

        var moreInfo = document.createElement("div");
        moreInfo.className = "moreInfo";
        moreInfo.innerHTML = "<em>" + device.model + "</em> by <em>" + device.manufacturer + "</em><br />at: "  + device.address;
        deviceDiv.appendChild(moreInfo);

        var sharescreen = document.createElement("button");
        sharescreen.id = "shareScreenButton";
        sharescreen.innerHTML = "share screen";
        sharescreen.onclick = shareScreen;
        deviceDiv.appendChild(sharescreen);        

        deviceList.appendChild(deviceDiv);
    }
    
    function shareScreen(){
        navigator.getUserMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia);
        
        if(navigator.getUserMedia){
            var constraints = {
                video: {
                    mediaSource: 'screen' // 'application' || 'browser' || 'window' || 'screen' || 'camera'
                }
            };

            function callback(localMediaStream) {
                window.URL.createObjectURL(localMediaStream);
                console.log("I'M HERE!");
            }

            function errorCallback(err) {
                console.error(err);
            }
        
            navigator.getUserMedia (constraints, callback, errorCallback);
        }
        else{
            console.log("no such navigator.getUserMedia");
        }
    }
})();