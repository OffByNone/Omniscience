module.exports = {
    toByteArray: function(string) {
        var length = (string || '').length;
        var arrayBuffer = new ArrayBuffer(length);
        var uint8Array = new Uint8Array(arrayBuffer);

        for (var i = 0; i < length; i++)
            uint8Array[i] = string.charCodeAt(i);

        return uint8Array;
    },
    toString: function(arrayBuffer) {
        var results = [];
        var uint8Array = new Uint8Array(arrayBuffer);

        for (var i = 0, length = uint8Array.length; i < length; i += 200000)
            results.push(String.fromCharCode(...uint8Array.subarray(i, i + 200000)));
        
        return results.join('');
    },
    merge: function(...arrayBuffers) {
        return arrayBuffers.reduce( (previous, current) => {
            var smushed = new Uint8Array(previous.byteLength + current.byteLength);
            smushed.set(new Uint8Array(previous), 0);
            smushed.set(new Uint8Array(current), previous.byteLength);
            return smushed.buffer;
        });
    },
    parseRange: function (rangeHeader) {
    	if (!rangeHeader) return 0;
    	var [type, offsetPlusDash] = rangeHeader.split('=');
    	if(type.toLowerCase() !== "bytes") return 0;
    	
    	return Number(offsetPlusDash.replace('-',''));
    },
    offsetBytes: function(offset, fileBytes){
    	if(!offset || offset <= 0) return fileBytes;
    	return fileBytes.subarray(offset);
    }
};