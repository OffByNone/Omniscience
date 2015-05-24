"use strict";
const CompositionRoot = require('./CompositionRoot');
const ChromeSdk = require('./SDK/ChromeSdk');

var compositionRoot = new CompositionRoot(ChromeSdk);

compositionRoot.createDeviceLocator().then(() => {
	compositionRoot.createButton();
	compositionRoot.createTab();
});



/*
	<script type="text/javascript" src='./out/libs/jquery-2.1.3.min.js'></script>
	<script type="text/javascript" src='./out/libs/bootstrap/js/bootstrap.min.js'></script>
	<script type="text/javascript" src='./out/libs/angular.min.js'></script>
	<script type="text/javascript" src='./out/libs/angular-route.min.js'></script>
	<script type="text/javascript" src='./out/libs/md5.js'></script>
	<script type="text/javascript" src='./out/libs/bootstrap-slider-4.8.3/bootstrap-slider.min.js'></script>
	<script type="text/javascript" src='./out/libs/angular-bootstrap-slider-0.1.2/slider.js'></script>
	<script type="text/javascript" src='./out/omniscience.js'></script>
	<script type="text/javascript" src='./out/Directives.js'></script>
	<script type="text/javascript" src='./out/controllers/Device.js'></script>
	<script type="text/javascript" src='./out/controllers/Home.js'></script>
	<script type="text/javascript" src='./out/controllers/About.js'></script>
	<script type="text/javascript" src='./out/controllers/DeviceInfo.js'></script>
	<script type="text/javascript" src='./out/controllers/DeviceList.js'></script>
	<script type="text/javascript" src='./out/controllers/Index.js'></script>
	<script type="text/javascript" src='./out/controllers/MatchStickSettings.js'></script>
	<script type="text/javascript" src='./out/controllers/Playlist.js'></script>
	<script type="text/javascript" src='./out/controllers/Playback.js'></script>
	<script type="text/javascript" src='./out/controllers/Capabilities.js'></script>
	<script type="text/javascript" src='./out/services/LastChangeEventParser.js'></script>
	<script type="text/javascript" src='./out/services/PubSub.js'></script>
	<script type="text/javascript" src='./out/services/EventService.js'></script>
	<script type="text/javascript" src='./out/services/ConnectionManagerService.js'></script>
	<script type="text/javascript" src='./out/services/MediaReceiverRegistrarService.js'></script>
	<script type="text/javascript" src='./out/services/SubscriptionService.js'></script>
	<script type="text/javascript" src='./out/services/AVTransportService.js'></script>
	<script type="text/javascript" src='./out/services/ContentDirectoryService.js'></script>
	<script type="text/javascript" src='./out/services/RenderingControlService.js'></script>
	<script type="text/javascript" src='./out/services/WfaWlanConfigService.js'></script>
	<script type="text/javascript" src='./out/services/StubFactory.js'></script>
	<script type="text/javascript" src='./out/services/FileService.js'></script>
	<script type="text/javascript" src='./out/services/InformationService.js'></script>
	<script type="text/javascript" src='./out/services/PersistenceService.js'></script>
	<script type="text/javascript" src='./out/services/MatchStickMessageGenerator.js'></script>
 */