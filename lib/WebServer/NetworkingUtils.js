module.exports = {
    toByteArray: function(string) {
        var length = (string || '').length;
        var arrayBuffer = new ArrayBuffer(length);
        var uint8Array = new Uint8Array(arrayBuffer);

        for (var i = 0; i < length; i++)
            uint8Array[i] = string.charCodeAt(i);

        return uint8Array;
    },
    toBuffer: function(stringOrByteArray){
    	if(typeof stringOrByteArray === "string")
    		return this.toByteArray(stringOrByteArray).buffer;
    	if(stringOrByteArray instanceof Uint8Array)
    		return stringOrByteArray.buffer;
    	else
    		throw new Error("argument must be of type string or Uint8Array");
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