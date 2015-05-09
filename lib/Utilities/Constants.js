exports.SSDPServiceType = 'upnp:rootdevice';//'ssdp:all';
exports.MatchStickMacAddresses = ['98-3B-16', '02-1A-11'];
exports.ChromecastMacAddresses = [];
exports.FireTVStickMacAddresses = [];
exports.ModelNames = {
	MatchStick: 'MatchStick',
	Chromecast: 'Eureka Dongle',
	Firestick: 'FireTV Stick'
};
exports.tab = {
	js: ['./libs/jquery-2.1.3.min.js', './libs/bootstrap/js/bootstrap.min.js', './libs/angular.min.js', './libs/unique.min.js', './libs/angular-route.min.js', './libs/md5.js',
		'./omniscience.js', './Directives.js',
		'./controllers/DeviceController.js', './controllers/HomeController.js', './controllers/AboutController.js', './controllers/DeviceInfoController.js', './controllers/DeviceListController.js', './controllers/IndexController.js', './controllers/DeviceSettingsController.js', './controllers/PlaylistController.js', './controllers/PlaybackController.js', './controllers/CapabilitiesController.js',
		'./services/LastChangeEventParser.js', './services/SubscriptionService.js', './services/PubSub.js', './services/EventService.js', './services/ConnectionManagerService.js', './services/AVTransportService.js', './services/ContentDirectoryService.js', './services/MediaReceiverRegistrarService.js', './services/RenderingControlService.js', './services/WfaWlanConfigService.js', './services/StubFactory.js', './services/FileService.js', './services/InformationService.js', './services/PersistenceService.js'
	],
	html: './index.html'
};
exports.MulticastIP = '239.255.255.250';
exports.MulticastPort = 1900;
exports.ipv4Regex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
exports.IPResolverMulticast = '239.255.255.255';
exports.SOAP = {
	ContentType: 'text/xml; charset=utf-8',
	Body: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<SOAP-ENV:Body>' +
                '<m:{1} xmlns:m="{0}">' +
                    '{2}' +
                '</m:{1}>' +
            '</SOAP-ENV:Body>' +
        '</SOAP-ENV:Envelope>'
};
exports.icon = {
	//16: './icons/logo_16.png', todo: make 16 version of logo
	32: './icons/logo_32.png',
	64: './icons/logo_64.png'
};

exports.activeEventPrefix = "active";
exports.passiveEventPrefix = "passive";

exports.headerLineDelimiter = '\r\n';
exports.requestLineDelimiter = ' ';
exports.httpOkStatus = {
    code: 200,
    reason: 'OK'
};
exports.httpFileNotFoundStatus = {
    code: 404,
    reason: 'File Not Found'
};
exports.httpTimeoutStatus = {
    code: 500,
    reason: 'Server Timed out while attempting to respond.'
};
exports.httpErrorStatus = {
    code: 500,
    reason: 'Server has encountered an error.'
};
exports.httpPartialStatus = {
	code: 206,
	reason: 'Partial Content'
}
exports.httpVersion = 'HTTP/1.1'
exports.serverName = 'omniscience-server-0.2.0';
exports.serverTimeoutInMilliseconds = 5000;
exports.socketBufferSize = 64 * 1024;

exports.MSearch = 'M-SEARCH * HTTP/1.1\r\n' +
                'HOST: {0}:{1}\r\n' +
                'ST: {2}\r\n' +
                'MAN: "ssdp:discover"\r\n' +
                'MX: 2\r\n\r\n';

exports.PeerNameResolutionProtocolST = 'urn:Microsoft Windows Peer Name Resolution Protocol: V4:IPV6:LinkLocal';

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
		8: 'Vendor-defined', //optional
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

exports.ServiceTypes = {
	AddressBook: "urn:schemas-upnp-org:service:AddressBook:1",
	AVTransport: 'urn:schemas-upnp-org:service:AVTransport:1',
	AVTransportv2: 'urn:schemas-upnp-org:service:AVTransport:2',
	AVTransportv3: 'urn:schemas-upnp-org:service:AVTransport:3',
	BasicManagement: "urn:schemas-upnp-org:service:BasicManagement:1",
	BasicManagementv2: "urn:schemas-upnp-org:service:BasicManagement:2",
	Calendar: "urn:schemas-upnp-org:service:Calendar:1",
	CallManagement: "urn:schemas-upnp-org:service:CallManagement:1",
	CallManagementv2: "urn:schemas-upnp-org:service:CallManagement:2",
	ConfigurationManagement: "urn:schemas-upnp-org:service:ConfigurationManagement:1",
	ConfigurationManagementv2: "urn:schemas-upnp-org:service:ConfigurationManagement:2",
	ConnectionManager: 'urn:schemas-upnp-org:service:ConnectionManager:1',
	ConnectionManagerv2: 'urn:schemas-upnp-org:service:ConnectionManager:2',
	ConnectionManagerv3: 'urn:schemas-upnp-org:service:ConnectionManager:3',
	ContentDirectory: 'urn:schemas-upnp-org:service:ContentDirectory:1',
	ContentDirectoryv2: 'urn:schemas-upnp-org:service:ContentDirectory:2',
	ContentDirectoryv3: 'urn:schemas-upnp-org:service:ContentDirectory:3',
	ContentDirectoryv4: 'urn:schemas-upnp-org:service:ContentDirectory:4',
	ContentSync: "urn:schemas-upnp-org:service:ContentSync:1",
	Controlvalve: "urn:schemas-upnp-org:service:controlValve:1",
	DataStore: "urn:schemas-upnp-org:service:DataStore:1",
	DeviceProtection: "urn:schemas-upnp-org:service:DeviceProtection:1",
	DeviceSecurity: "urn:schemas-upnp-org:service:DeviceSecurity:1",
	DIALMultiscreen: 'urn:dial-multiscreen-org:service:dial:1',
	DigitalSecurityCameraSettings: "urn:schemas-upnp-org:service:DigitalSecurityCameraSettings:1",
	DigitalSecurityCameraStillImage: "urn:schemas-upnp-org:service:DigitalSecurityCameraStillImage:1",
	DigitalSecurityCameraMotionImage: "urn:schemas-upnp-org:service:DigitalSecurityCameraMotionImage:1",
	Dimming: "urn:schemas-upnp-org:service:DimmingService:1 ",
	EnergyManagement: "urn:schemas-upnp-org:service:EnergyManagement:1",
	ExternalActivity: "urn:schemas-upnp-org:service:ExternalActivity:1",
	FanSpeed: "urn:schemas-upnp-org:service:FanSpeed:1",
	Feeder: "urn:schemas-upnp-org:service:Feeder:1",
	HVACUserOperatingMode: "urn:schemas-upnp-org:service:HVAC_UserOperatingMode:1",
	HVACFanOperatingMode: "urn:schemas-upnp-org:service:HVAC_FanOperatingMode:1",
	HVACSetpointSchedule: "urn:schemas-upnp-org:service:HVAC_SetpointSchedule:1",
	InboundConnectionConfig: "urn:schemas-upnp-org:service:InboundConnectionConfig:1",
	InputConfig: "urn:schemas-upnp-org:service:InputConfig:1",
	IRCC: 'urn:schemas-sony-com:service:IRCC:1',
	LinkAuthentication: "urn:schemas-upnp-org:service:LinkAuthentication:1",
	Layer3Forwarding: 'urn:schemas-upnp-org:service:Layer3Forwarding:1',
	LowPower: "urn:schemas-upnp-org:service:LowerPowerDevice:1",
	MediaManagement: "urn:schemas-upnp-org:service:MediaManagement:1",
	MediaManagementv2: "urn:schemas-upnp-org:service:MediaManagement:2",
	MediaReceiverRegistrar: 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1',
	Messaging: "urn:schemas-upnp-org:service:Messaging:1",
	Messagingv2: "urn:schemas-upnp-org:service:Messaging:2",
	MicrosoftWindowsPeerNameResolutionProtocol: 'urn:Microsoft Windows Peer Name Resolution Protocol:v4:IPV6:LinkLocal',
	Party: 'urn:schemas-sony-com:service:Party:1',
	Presence: "urn:schemas-upnp-org:service:Presence:1",
	PrintBasic: "urn:schemas-upnp-org:service:PrintBasic:1",
	PrintEnhancedLayout: "urn:schemas-upnp-org:service:PrintEnhancedLayout:1",
	QoSDevice: "urn:schemas-upnp-org:service:QosDevice:1",
	QoSDevicev2: "urn:schemas-upnp-org:service:QosDevice:2",
	QoSDevicev3: "urn:schemas-upnp-org:service:QosDevice:3",
	QoSManager: "urn:schemas-upnp-org:service:QosManager:1",
	QoSManagerv2: "urn:schemas-upnp-org:service:QosManager:2",
	QoSManagerv3: "urn:schemas-upnp-org:service:QosManager:3",
	QoSPolicyHolder: "urn:schemas-upnp-org:service:QosPolicyHolder:1",
	QoSPolicyHolderv2: "urn:schemas-upnp-org:service:QosPolicyHolder:2",
	QoSPolicyHolderv3: "urn:schemas-upnp-org:service:QosPolicyHolder:3",
	RadiusClient: "urn:schemas-upnp-org:service:RadiusClient:1",
	RemoteAccessDiscoveryAgentSync: "urn:schemas-upnp-org:service:RADASync:1",
	RemoteAccessDiscoveryAgentSyncv2: "urn:schemas-upnp-org:service:RADASync:2",
	RemoteAccessDiscoveryAgentConfig: "urn:schemas-upnp-org:service:RADAConfig:1",
	RemoteAccessDiscoveryAgentConfigv2: "urn:schemas-upnp-org:service:RADAConfig:2",
	RemoteAccessTransportAgentConfig: "urn:schemas-upnp-org:service:RATAConfig:1",
	RemoteUIClient: "urn:schemas-upnp-org:service:RemoteUIClient:1",
	RemoteUIServer: "urn:schemas-upnp-org:service:RemoteUIServer:1",
	RenderingControl: 'urn:schemas-upnp-org:service:RenderingControl:1',
	SamsungMultiscreen: "urn:samsung.com:service:MultiScreenService:1",
	Scan: "urn:schemas-upnp-org:service:Scan:1",
	ScheduledRecording: "urn:schemas-upnp-org:service:ScheduledRecording:1",
	ScheduledRecordingv2: "urn:schemas-upnp-org:service:ScheduledRecording:2",
	SecurityConsole: "urn:schemas-upnp-org:service:SecurityConsole:1",
	SensorTransportGeneic: "urn:schemas-upnp-org:service:SensorTransportGeneric:1",
	SoftwareManagement: "urn:schemas-upnp-org:service:SoftwareManagement:1",
	SoftwareManagementv2: "urn:schemas-upnp-org:service:SoftwareManagement:2",
	SwitchPower: "urn:schemas-upnp-org:service:SwitchPower:1 ",
	TemperatureSensor: "urn:schemas-upnp-org:service:TemperatureSensor:1",
	TemperatureSetpoint: "urn:schmeas-upnp-org:service:TemperatureSetpoint:1",
	TwoWayMotionMotor: "urn:schemas-upnp-org:service:TwoWayMotionMotor:1",
	WANCommonInterfaceConfig: 'urn:schemas-upnp-org:service:WANCommonInterfaceConfig:1',
	WANIPConnection: 'urn:schemas-upnp-org:service:WANIPConnection:1',
	WANPPPConnection: 'urn:schemas-upnp-org:service:WANPPPConnection:1',
	WLANConfiguration: "urn:schemas-upnp-org:service:WLANConfiguration:1",
	WFAWLANConfig: 'urn:schemas-wifialliance-org:service:WFAWLANConfig:1',
	XCIS: 'urn:schemas-sony-com:service:X_CIS:1'
};
exports.DeviceTypes = {
	Basic: "urn:schemas-upnp-org:device:Basic:1",
	BinaryLight: "urn:schemas-upnp-org:device:BinaryLight:1",
	DIALMultiscreen: 'urn:dial-multiscreen-org:device:dial:1',
	DigitalSecurityCamera: "urn:schemas-upnp-org:device:DigitalSecurityCamera:1",
	HVAC: "urn:schemas-upnp-org:device:HVAC_System:1",
	HVACZoneThermostat: "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1",
	InternetGateway: "urn:schemas-upnp-org:device:InternetGatewayDevice:1",
	InternetGatewayv2: "urn:schemas-upnp-org:device:InternetGatewayDevice:2",
	Light: "urn:schemas-upnp-org:device:Light:1",
	ManageableDevice: "urn:schemas-upnp-org:device:ManageableDevice:1",
	ManageableDevicev2: "urn:schemas-upnp-org:device:ManageableDevice:2",
	MediaRenderer: "urn:schemas-upnp-org:device:MediaRenderer:1",
	MediaRendererv2: "urn:schemas-upnp-org:device:MediaRenderer:2",
	MediaRendererv3: "urn:schemas-upnp-org:device:MediaRenderer:3",
	MediaServer: "urn:schemas-upnp-org:device:MediaServer:1",
	MediaServerv2: "urn:schemas-upnp-org:device:MediaServer:2",
	MediaServerv3: "urn:schemas-upnp-org:device:MediaServer:3",
	MediaServerv4: "urn:schemas-upnp-org:device:MediaServer:4",
	Printer: "urn:schemas-upnp-org:device:printer:1",
	RemoteAccessClient: "urn:schemas-upnp-org:device:RAClient:1",
	RemoteAccessDiscoveryAgent: "urn:schemas-upnp-org:device:RADiscoveryAgent:2",
	RemoteAccessServer: "urn:schemas-upnp-org:device:RAServer:1",
	RemoteAccessServerv2: "urn:schemas-upnp-org:device:RAServer:2",
	RemoteUIClient: "urn:schemas-upnp-org:device:RemoteUIClientDevice:1",
	RemoteUIServer: "urn:schemas-upnp-org:device:RemoteUIServerDevice:1",
	Root: 'upnp:rootdevice',
	Scanner: "urn:schemas-upnp-org:device:Scanner:1",
	SensorManagement: "urn:schemas-upnp-org:device:SensorManagement:1",
	SolarProtectionBlind: "urn:schemas-upnp-org:device:SolarProtectionBlind:1",
	TelephonyClient: "urn:schemas-upnp-org:device:TelephonyClient:1",
	TelephonyClientv2: "urn:schemas-upnp-org:device:TelephonyClient:2",
	TelephonyServer: "urn:schemas-upnp-org:device:TelephonyServer:1",
	TelephonyServerv2: "urn:schemas-upnp-org:device:TelephonyServer:2",
	WAN: 'urn:schemas-upnp-org:device:WANDevice:1',
	WANConnection: 'urn:schemas-upnp-org:device:WANConnectionDevice:1',
	WLANAccessPoint: "urn:schemas-upnp-org:device:WLANAccessPointDevice:1",
	WFA: 'urn:schemas-wifialliance-org:device:WFADevice:1'
};