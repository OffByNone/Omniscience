'use strict';

exports.tab = {
	js: ['./libs/jquery-2.1.3.min.js', './libs/bootstrap/js/bootstrap.min.js', './libs/angular.min.js', './libs/angular-route.min.js', './libs/md5.js', './libs/bootstrap-slider-4.8.3/bootstrap-slider.min.js', './libs/angular-bootstrap-slider-0.1.2/slider.js', './Omniscience.js', './Directives.js', './controllers/Device.js', './controllers/Home.js', './controllers/About.js', './controllers/DeviceInfo.js', './controllers/DeviceList.js', './controllers/Index.js', './controllers/MatchStickSettings.js', './controllers/Playlist.js', './controllers/Playback.js', './controllers/Capabilities.js', './services/LastChangeEventParser.js', './services/PubSub.js', './services/EventService.js', './services/ConnectionManagerService.js', './services/MediaReceiverRegistrarService.js', './services/SubscriptionService.js', './services/AVTransportService.js', './services/ContentDirectoryService.js', './services/RenderingControlService.js', './services/WfaWlanConfigService.js', './services/StubFactory.js', './services/FileService.js', './services/InformationService.js', './services/PersistenceService.js', './services/MatchStickMessageGenerator.js', './services/JXON.js'],
	html: './Foreground/Firefox.html'
};
exports.icon = {
	16: './icons/logo_16.png',
	32: './icons/logo_32.png',
	64: './icons/logo_64.png'
};
exports.avTransportServiceConstants = {
	transportStates: {
		0: 'STOPPED',
		1: 'PLAYING',
		2: 'TRANSITIONING', //optional
		3: 'PAUSED_PLAYBACK', //optional
		4: 'PAUSED_RECORDING', //optional
		5: 'RECORDING', //optional
		6: 'NO_MEDIA_PRESENT' //optional
	},
	transportStatuses: {
		0: 'OK',
		1: 'STOPPED',
		2: 'ERROR_OCCURRED'
	},
	playModes: {
		0: 'NORMAL',
		1: 'SHUFFLE', //optional
		3: 'REPEAT_ONE', //optional
		4: 'REPEAT_ALL', //optional
		5: 'RANDOM', //optional
		6: 'DIRECT_1', //optional
		7: 'INTRO', //optional
		8: 'Vendor-defined' //optional
	},
	transportActions: {
		0: 'Play',
		1: 'Stop',
		2: 'Pause',
		3: 'Seek',
		4: 'Next',
		5: 'Previous',
		6: 'Record'
	}
};
//# sourceMappingURL=Constants.js.map