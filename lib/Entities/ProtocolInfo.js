class ProtocolInfo {
    constructor() {
        this.additionalInfo = {};
        this.contentFormat = {};
        this.network = ""; //seems to always be "*"
        this.protocol = ""; //usually http-get
        this.type = ""; //either serve or render
    }
}

module.exports = ProtocolInfo;
