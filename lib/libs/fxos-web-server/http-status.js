const Constants = require('../../Utilities/Constants');

const HTTPStatus = {
    getStatusLine: function (status) {
        var reason = Constants.HTTPServer.STATUS_CODES[status] || 'Unknown';
        return [Constants.HTTPServer.HTTP_VERSION, status, reason].join(' ') + Constants.HTTPServer.CRLF;
    }
}

module.exports = HTTPStatus;
