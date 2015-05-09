
class HttpRequest {
	constructor() {
		this.headers = [];
		this.parameters = [];
		this.method = "";
		this.body = "";
		this.path = "";
		this.socket = {};
	}
}

module.exports = HttpRequest;
