"use strict";
(function () {

    var media = {
        video: document.getElementById("video"),
        audio: document.getElementById("audio"),
        image: document.getElementById("image")
    };
    var info = document.getElementById("info");
    var isPlaying = false;

    var messageChannel = { on: function on() {} };

    DetectRTC.load(function () {
        info.innerHTML += JSON.stringify(DetectRTC);
    });

    window.addEventListener("keydown", function (event) {
        var command = keyCodes[event.keyCode];
        info.innerHTML += keyCodes[event.keyCode];
        if (command === 'play/pause') {
            if (!isPlaying) executeCommands(['play'], 'video');else executeCommands(['pause'], 'video');
            isPlaying = !isPlaying;
        } else executeCommands([command], 'video');
    }, false);

    messageChannel.on("message", function (senderId, data) {
        var message = JSON.parse(data);

        if (message.hasOwnProperty("properties") && typeof message.properties === "object") setProperties(message.properties, message.type);
        if (message.hasOwnProperty("commands") && Array.isArray(message.commands) && message.commands.length > 0) executeCommands(message.commands, message.type);
    });

    function executeCommands(commands, type) {
        commands.forEach(function (command) {
            media[type][command]();
            info.innerHTML += type + " " + command + "<br />";
        });
    }

    function setProperties(properties, type) {
        for (var property in properties) if (properties.hasOwnProperty(property)) {
            media[type][property] = properties[property];
            info.innerHTML += type + " " + property + " " + properties[property] + "<br />";
        }
    }

    setProperties({ src: "../BigBuckBunny.mp4" }, 'video');

    var keyCodes = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        179: 'play/pause',
        227: 'rewind',
        228: 'fastforward'
    };
})();