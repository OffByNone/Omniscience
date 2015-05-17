class Device {
    constructor() {
    	this.address = null; //URL
    	this.capabilities = null; //Capabilities
    	this.icons = [];
    	this.id = null; //m5d of device address
    	this.language = null; //{name:'', code: ''}
    	this.macAddress = null;
    	this.manufacturer = null; //DeviceManufacturer
        this.model = null; //DeviceModel
        this.name = "";
    	//this.playlist = [];
        this.rawDiscoveryInfo = ""; //ssdpDescription text
        this.responseHash = null; //md5 of the response.text
        this.serialNumber = "";
        this.services = [];
        this.softwareVersion = null;
        this.ssdpDescription = ""; //URL to xml
        this.state = {};
        this.timezone = null;
        this.type = null; //UPnPExtensionInfo
        this.upc = "";
        this.upnpVersion = null; //UPnPVersion
        this.uuid = "";
        this.webPage = ""; //URL to presentationURL
    }
}

module.exports = Device;