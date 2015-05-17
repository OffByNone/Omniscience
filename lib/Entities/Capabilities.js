class Capabilities {
    constructor() {
        this.mirror = false;
        this.audio = false;
        this.video = false;
        this.image = false;
        this.router = false;
        this.server = false;
    	this.supportedFormats = [];
    }
}

module.exports = Capabilities;