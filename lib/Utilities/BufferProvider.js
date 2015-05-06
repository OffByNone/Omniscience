const { Buffer } = require('sdk/io/buffer'); // https://github.com/mozilla/addon-sdk/tree/master/lib/sdk/io

const BufferProvider = {
    createBuffer: function(bufferContent){
        return new Buffer(bufferContent);
    }
}

module.exports = BufferProvider;