"use strict";
(function() {
    var appid = "~mediaPlayerDemo"; //Unique id of your application, must start with a ~
    var matchstickIPAddress = "192.168.1.13"; //IP address of the matchstick
    var receiverAppUrl = "//offbynone.github.io/Matchstick-Video-Player/Receiver/Receiver.html"; //Url of the page to load on the receiver
    var timeout = -1; //after not communicating with the sender for this many milliseconds return to the default matchstick screen. -1 means don't timeout
    var useInterprocessCommunication = true; //not sure what this means for my application
    var isRunning = false;
    var isPlaying = false;
    var messageChannel; //used to send messages between sender and receiver
    //var senderDaemon = new SenderDaemon(matchstickIPAddress, appid); //comes from the sender api, is the object which will be used to communicate with the matchstick

    var types = document.getElementById("types");
    var commands = document.getElementById("commands");
    var properties = document.getElementById("properties");
    var propertyValue = document.getElementById("propertyValue");
    var send = document.getElementById("send");

    self.port.on("load", function(values){
        matchstickIPAddress = new URL(values[0]).host;
        receiverAppUrl = values[1];
        var thingUrl = values[2];
        var senderDaemon = new SenderDaemon(matchstickIPAddress, appid);
        senderDaemon.openApp(receiverAppUrl, timeout, useInterprocessCommunication);
        senderDaemon.on("appopened", function (channel) {
            messageChannel = channel;
            var message = {
                type: "video",
                properties : {src: thingUrl},
                commands : ["play"]
            };
            messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
        });
    });
    


    document.getElementById("toggleAppStatus").onclick  = function(){
        if(isRunning){
            this.innerHTML = "Launch App";
            senderDaemon.closeApp();
        }else{
            this.innerHTML = "Close App";
            senderDaemon.openApp(receiverAppUrl, timeout, useInterprocessCommunication);
        }

        isRunning = !isRunning;
    };
    send.onclick = function(){

        if(!isRunning) return alert("You must launch the application before you can send it commands and such.");
        if(types.value === "-1") return alert("You must select a type.");
        if(properties.value === "-1" && commands.value === "-1") return alert("You must select either a property or a command.");
        if(properties.value !== "-1" && propertyValue.value === "") return alert("You must either un-select the property or set a value.");

        var message = {
            type: types.value,
            properties : {},
            commands : []
        };

        if(properties.value !== "-1") message.properties[properties.value] = propertyValue.value;
        if(commands.value !== "-1") message.commands.push(commands.value);

        properties.value = "-1";
        commands.value = "-1";
        types.value = "-1";
        propertyValue.value = "";

        messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
    };
})();


/*
    Properties
        audioTracks<AudioTrackList>
        buffered<TimeRanges>(Read Only)
        controller<MediaController>
        controls<Boolean> - show controls
        crossOrigin<String>
        currentSrc<String>(Read Only)
        currentTime<double> - current playback time in seconds
        defaultMuted<Boolean>
        defaultPlaybackRate<double> - Default playback rate. 1.0 is "normal speed," lower than 1.0 is slower, higher is faster. 0.0 is invalid and throws a NOT_SUPPORTED_ERR exception.
        duration<double>(Read Only) - The length of the media in seconds, or zero if no media data is available.  If the media data is available but the length is unknown, this value is NaN.  If the media is streamed and has no predefined length, the value is Inf.
        ended<Boolean>(Read Only)
        error<MediaError>(Read Only) - The MediaError object for the most recent error, or null if there has not been an error.
        mediaGroup<String> - Reflects the mediagroup HTML attribute, indicating the name of the group of elements it belongs to. A group of media elements shares a common controller.
        muted<Boolean>
        networkState<unsigned short> - current state of fetching the media over the network. {NETWORK_EMPTY : 0, NETWORK_IDLE :	1, NETWORK_LOADING : 2, NETWORK_NO_SOURCE : 3}
        paused<Boolean>(Read Only)
        playbackRate<double>
        played<TimeRanges>(Read Only)
        preload<String> - what data should be preloaded, if any. Possible values are: none, metadata, auto
        readyState<unsigned short> - {HAVE_NOTHING : 0, HAVE_METADATA : 1, HAVE_CURRENT_DATA : 2, HAVE_FUTURE_DATA : 3, HAVE_ENOUGH_DATA : 4}
        seekable<TimeRanges>(Read Only)
        seeking<Boolean>(Read Only)
        textTracks<TextTrackList>
        videoTracks<VideoTrackList>
    */
