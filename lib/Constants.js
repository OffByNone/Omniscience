exports.SSDPServiceType = 'ssdp:all';
exports.MatchStickMacAddresses = ['98:3B:16', '02:1A:11'];
exports.ModelNames = {
    MatchStick: 'MatchStick',
    Chromecast: 'Eureka Dongle',
    Firestick: 'FireTV Stick'
};
exports.tab = {
	js: ['./libs/jquery-2.1.3.min.js', './libs/bootstrap/js/bootstrap.min.js', './libs/angular.min.js', './libs/angular-route.min.js', './libs/md5.js', './libs/toastr/toastr.min.js',
		'./omniscience.js', './Directives.js',
		'./controllers/DeviceController.js', './controllers/HomeController.js', './controllers/AboutController.js', './controllers/DeviceInfoController.js', './controllers/DeviceListController.js', './controllers/IndexController.js', './controllers/DeviceSettingsController.js', './controllers/PlaylistController.js', './controllers/PlaybackController.js',
		'./services/PubSub.js', './services/EventService.js', './controllers/ConnectionManager.js', './services/ConnectionManagerService.js', './services/AVTransportService.js', './services/ContentDirectoryService.js', './services/MediaReceiverRegistrarService.js', './services/RenderingControlService.js', './services/WfaWlanConfigService.js', './services/StubFactory.js', './services/PlaybackService.js', './services/FileService.js', './services/InformationService.js'
	],
    html: './index.html'
};
exports.MulticastIP = '239.255.255.250';
exports.MulticastPort = 1900;
exports.SOAP = {
    ContentType : 'text/xml; charset=utf-8',
    Body : '<?xml version="1.0" encoding="utf-8"?>\n'+
        '<SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">'+
            '<SOAP-ENV:Body>'+
                '<m:{1} xmlns:m="{0}">'+
                    '{2}'+
                '</m:{1}>'+
            '</SOAP-ENV:Body>'+
        '</SOAP-ENV:Envelope>'
};


exports.HTTPServer = {
    HTTP_VERSION : 'HTTP/1.1'
};

exports.MSearch = 'M-SEARCH * HTTP/1.1\r\n' +
                'HOST: {0}:{1}\r\n' +
                'ST: {2}\r\n' +
                'MAN: "ssdp:discover"\r\n' +
                'MX: 1\r\n\r\n';

exports.PeerNameResolutionProtocolST = 'urn:Microsoft Windows Peer Name Resolution Protocol: V4:IPV6:LinkLocal';

exports.ServiceTypes = [
	["Address Book", "urn:schemas-upnp-org:service:AddressBook:1"],
	["AV Transport", 'urn:schemas-upnp-org:service:AVTransport:1'],
	["AV Transport v2", 'urn:schemas-upnp-org:service:AVTransport:2'],
	["AV Transport v3", 'urn:schemas-upnp-org:service:AVTransport:3'],
	["Basic Management", "urn:schemas-upnp-org:service:BasicManagement:1"],
	["Basic Management v2", "urn:schemas-upnp-org:service:BasicManagement:2"],
	["Calendar", "urn:schemas-upnp-org:service:Calendar:1"],
	["Call Management", "urn:schemas-upnp-org:service:CallManagement:1"],
	["Call Management v2", "urn:schemas-upnp-org:service:CallManagement:2"],
	["Configuration Management", "urn:schemas-upnp-org:service:ConfigurationManagement:1"],
	["Configuration Management v2", "urn:schemas-upnp-org:service:ConfigurationManagement:2"],
	["Connection Manager", 'urn:schemas-upnp-org:service:ConnectionManager:1'],
	["Connection Manager v2", 'urn:schemas-upnp-org:service:ConnectionManager:2'],
	["Connection Manager v3", 'urn:schemas-upnp-org:service:ConnectionManager:3'],
	["Content Directory", 'urn:schemas-upnp-org:service:ContentDirectory:1'],
	["Content Directory v2", 'urn:schemas-upnp-org:service:ContentDirectory:2'],
	["Content Directory v3", 'urn:schemas-upnp-org:service:ContentDirectory:3'],
	["Content Directory v4", 'urn:schemas-upnp-org:service:ContentDirectory:4'],
	["Content Sync", "urn:schemas-upnp-org:service:ContentSync:1"],
	["Control Valve", "urn:schemas-upnp-org:service:controlValve:1"],
	["Data Store", "urn:schemas-upnp-org:service:DataStore:1"],
	["Device Protection", "urn:schemas-upnp-org:service:DeviceProtection:1"],
	["Device Security", "urn:schemas-upnp-org:service:DeviceSecurity:1"],
	["DIAL Multiscreen", 'urn:dial-multiscreen-org:service:dial:1'],
	["Digital Security Camera Settings", "urn:schemas-upnp-org:service:DigitalSecurityCameraSettings:1"],
	["Digital Security Camera Still Image", "urn:schemas-upnp-org:service:DigitalSecurityCameraStillImage:1"],
	["Digital Security Camera Motion Image", "urn:schemas-upnp-org:service:DigitalSecurityCameraMotionImage:1"],
	["Dimming", "urn:schemas-upnp-org:service:DimmingService:1 "],
	["Energy Management", "urn:schemas-upnp-org:service:EnergyManagement:1"],
	["External Activity", "urn:schemas-upnp-org:service:ExternalActivity:1"],
	["Fan Speed", "urn:schemas-upnp-org:service:FanSpeed:1"],
	["Feeder", "urn:schemas-upnp-org:service:Feeder:1"],
	["HVAC User Operating Mode", "urn:schemas-upnp-org:service:HVAC_UserOperatingMode:1"],
	["HVAC Fan Operating Mode", "urn:schemas-upnp-org:service:HVAC_FanOperatingMode:1"],
	["HVAC Setpoint Schedule", "urn:schemas-upnp-org:service:HVAC_SetpointSchedule:1"],
	["Inbound Connection Config", "urn:schemas-upnp-org:service:InboundConnectionConfig:1"],
	["Input Config", "urn:schemas-upnp-org:service:InputConfig:1"],
	["IRCC", 'urn:schemas-sony-com:service:IRCC:1'],
	["Link Authentication", "urn:schemas-upnp-org:service:LinkAuthentication:1"],
	["Layer 3 Forwarding", 'urn:schemas-upnp-org:service:Layer3Forwarding:1'],
	["Low Power", "urn:schemas-upnp-org:service:LowerPowerDevice:1"],
	["Media Management", "urn:schemas-upnp-org:service:MediaManagement:1"],
	["Media Management v2", "urn:schemas-upnp-org:service:MediaManagement:2"],
	["Media Receiver Registrar", 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1'],
	["Messaging", "urn:schemas-upnp-org:service:Messaging:1"],
	["Messaging v2", "urn:schemas-upnp-org:service:Messaging:2"],
	["Microsoft Windows Peer Name Resolution Protocol", 'urn:Microsoft Windows Peer Name Resolution Protocol: V4:IPV6:LinkLocal'],
	["Party", 'urn:schemas-sony-com:service:Party:1'],
	["Presence", "urn:schemas-upnp-org:service:Presence:1"],
	["Print Basic", "urn:schemas-upnp-org:service:PrintBasic:1"],
	["Print Enhanced Layout", "urn:schemas-upnp-org:service:PrintEnhancedLayout:1"],
	["QoS Device", "urn:schemas-upnp-org:service:QosDevice:1"],
	["QoS Device v2", "urn:schemas-upnp-org:service:QosDevice:2"],
	["QoS Device v3", "urn:schemas-upnp-org:service:QosDevice:3"],
	["QoS Manager", "urn:schemas-upnp-org:service:QosManager:1"],
	["QoS Manager v2", "urn:schemas-upnp-org:service:QosManager:2"],
	["QoS Manager v3", "urn:schemas-upnp-org:service:QosManager:3"],
	["QoS Policy Holder", "urn:schemas-upnp-org:service:QosPolicyHolder:1"],
	["QoS Policy Holder v2", "urn:schemas-upnp-org:service:QosPolicyHolder:2"],
	["QoS Policy Holder v3", "urn:schemas-upnp-org:service:QosPolicyHolder:3"],
	["Radius Client", "urn:schemas-upnp-org:service:RadiusClient:1"],
	["Remote Access Discovery Agent Sync", "urn:schemas-upnp-org:service:RADASync:1"],
	["Remote Access Discovery Agent Sync v2", "urn:schemas-upnp-org:service:RADASync:2"],
	["Remote Access Discovery Agent Config", "urn:schemas-upnp-org:service:RADAConfig:1"],
	["Remote Access Discovery Agent Config v2", "urn:schemas-upnp-org:service:RADAConfig:2"],
	["Remote Access Transport Agent Config", "urn:schemas-upnp-org:service:RATAConfig:1"],
	["Remote UI Client", "urn:schemas-upnp-org:service:RemoteUIClient:1"],
	["Remote UI Server", "urn:schemas-upnp-org:service:RemoteUIServer:1"],
	["Rendering Control", 'urn:schemas-upnp-org:service:RenderingControl:1'],
	["Samsung Multiscreen", "urn:samsung.com:service:MultiScreenService:1"],
	["Scan", "urn:schemas-upnp-org:service:Scan:1"],
	["Scheduled Recording", "urn:schemas-upnp-org:service:ScheduledRecording:1"],
	["Scheduled Recording v2", "urn:schemas-upnp-org:service:ScheduledRecording:2"],
	["Security Console", "urn:schemas-upnp-org:service:SecurityConsole:1"],
	["Sensor Transport Geneic", "urn:schemas-upnp-org:service:SensorTransportGeneric:1"],
	["Software Management", "urn:schemas-upnp-org:service:SoftwareManagement:1"],
	["Software Management v2", "urn:schemas-upnp-org:service:SoftwareManagement:2"],
	["Switch Power", "urn:schemas-upnp-org:service:SwitchPower:1 "],
	["Temperature Sensor", "urn:schemas-upnp-org:service:TemperatureSensor:1"],
	["Temperature Setpoint", "urn:schmeas-upnp-org:service:TemperatureSetpoint:1"],
	["Two Way Motion Motor", "urn:schemas-upnp-org:service:TwoWayMotionMotor:1"],
	["WAN Common Interface Config", 'urn:schemas-upnp-org:service:WANCommonInterfaceConfig:1'],
	["WAN IP Connection", 'urn:schemas-upnp-org:service:WANIPConnection:1'],
	["WAN PPP Connection", 'urn:schemas-upnp-org:service:WANPPPConnection:1'],
	["WLAN Configuration", "urn:schemas-upnp-org:service:WLANConfiguration:1"],
	["WFA WLAN Config", 'urn:schemas-wifialliance-org:service:WFAWLANConfig:1'],
	["XCIS", 'urn:schemas-sony-com:service:X_CIS:1']
];
exports.DeviceTypes = [
	["Basic", "urn:schemas-upnp-org:device:Basic:1"],
	["Binary Light", "urn:schemas-upnp-org:device:BinaryLight:1"],
	["DIAL Multiscreen", 'urn:dial-multiscreen-org:device:dial:1'],
	["Digital Security Camera", "urn:schemas-upnp-org:device:DigitalSecurityCamera:1"],
	["HVAC", "urn:schemas-upnp-org:device:HVAC_System:1"],
	["HVAC Zone Thermostat", "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1"],
	["Internet Gateway", "urn:schemas-upnp-org:device:InternetGatewayDevice:1"],
	["Internet Gateway v2", "urn:schemas-upnp-org:device:InternetGatewayDevice:2"],
	["Light", "urn:schemas-upnp-org:device:Light:1"],
	["Manageable Device", "urn:schemas-upnp-org:device:ManageableDevice:1"],
	["Manageable Device v2", "urn:schemas-upnp-org:device:ManageableDevice:2"],
	["Media Renderer", "urn:schemas-upnp-org:device:MediaRenderer:1"],
	["Media Renderer v2", "urn:schemas-upnp-org:device:MediaRenderer:2"],
	["Media Renderer v3", "urn:schemas-upnp-org:device:MediaRenderer:3"],
	["Media Server", "urn:schemas-upnp-org:device:MediaServer:1"],
	["Media Server v2", "urn:schemas-upnp-org:device:MediaServer:2"],
	["Media Server v3", "urn:schemas-upnp-org:device:MediaServer:3"],
	["Media Server v4", "urn:schemas-upnp-org:device:MediaServer:4"],
	["Printer", "urn:schemas-upnp-org:device:printer:1"],
	["Remote Access Client", "urn:schemas-upnp-org:device:RAClient:1"],
	["Remote Access Discovery Agent", "urn:schemas-upnp-org:device:RADiscoveryAgent:2"],
	["Remote Access Server", "urn:schemas-upnp-org:device:RAServer:1"],
	["Remote Access Server v2", "urn:schemas-upnp-org:device:RAServer:2"],
	["Remote UI Client", "urn:schemas-upnp-org:device:RemoteUIClientDevice:1"],
	["Remote UI Server", "urn:schemas-upnp-org:device:RemoteUIServerDevice:1"],
	["Root", 'upnp:rootdevice'],
	["Scanner", "urn:schemas-upnp-org:device:Scanner:1"],
	["Sensor Management", "urn:schemas-upnp-org:device:SensorManagement:1"],
	["Solar Protection Blind", "urn:schemas-upnp-org:device:SolarProtectionBlind:1"],
	["Telephony Client", "urn:schemas-upnp-org:device:TelephonyClient:1"],
	["Telephony Client v2", "urn:schemas-upnp-org:device:TelephonyClient:2"],
	["Telephony Server", "urn:schemas-upnp-org:device:TelephonyServer:1"],
	["Telephony Server v2", "urn:schemas-upnp-org:device:TelephonyServer:2"],
	["WAN", 'urn:schemas-upnp-org:device:WANDevice:1'],
	["WAN Connection", 'urn:schemas-upnp-org:device:WANConnectionDevice:1'],
	["WLAN Access Point", "urn:schemas-upnp-org:device:WLANAccessPointDevice:1"],
	["WFA", 'urn:schemas-wifialliance-org:device:WFADevice:1']
];