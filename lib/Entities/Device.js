class Device {
    constructor() {
        this.capabilities = null; //Capabilities
        this.model = null; //DeviceModel
        this.type = null; //Type
        this.manufacturer = null; //DeviceManufacturer
        this.upnpVersion = null; //UPnPVersion
        this.address = null; //URL
        this.id = null; //m5d of device address
        this.serialNumber = "";
        this.webPage = ""; //URL to presentationURL
        this.ssdpDescription = ""; //URL to xml
        this.responseHash = null; //md5 of the response.text
        this.name = "";
        this.udn = "";
        this.upc = "";
        this.rawDiscoveryInfo = ""; //ssdpDescription text
        this.icons = [];
        this.services = [];
        this.ssdpResponseHeaders = {};
        //this.playlist = [];
        //this.supportedFormats = [];
        this.state = {};
    }
}

module.exports = Device;