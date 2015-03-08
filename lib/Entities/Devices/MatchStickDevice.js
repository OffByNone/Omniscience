const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../../Constants');

const MatchStickDevice = Class({
    initialize: function initialize() {
        this.mirrorCapable = true;
        this.audioCapable = true;
        this.videoCapable = true;
        this.imageCapable = true;
        this.serviceKey = constants.Services.MatchStick;
        this.protocolInfo = [
            {protocol: 'http-get',network: '*',medium: 'image',containerType: 'jpeg'},            
            {protocol: 'http-get',network: '*',medium: 'image',containerType: 'jpg'},
            {protocol: 'http-get',network: '*',medium: 'image',containerType: 'png'},            
            {protocol: 'http-get',network: '*',medium: 'image',containerType: 'webp'},
            {protocol: 'http-get',network: '*',medium: 'image',containerType: 'bmp'},
            {protocol: 'http-get',network: '*',medium: 'image',containerType: 'gif'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'mp4'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'webm'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'mov'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'mkv'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'avi'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: '3gp'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'flv'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'f4v'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'mpeg2ts'},
            {protocol: 'http-get',network: '*',medium: 'video',containerType: 'mpeg2ps'},
            {protocol: 'http-get',network: '*',medium: 'audio',containerType: 'aac'},
            {protocol: 'http-get',network: '*',medium: 'audio',containerType: 'ogg'},
            {protocol: 'http-get',network: '*',medium: 'audio',containerType: 'mp3'},
            {protocol: 'http-get',network: '*',medium: 'audio',containerType: 'flac'},
            {protocol: 'http-get',network: '*',medium: 'audio',containerType: 'amr'},
        ];        
	}
});

exports.MatchStickDevice = MatchStickDevice;