/*jshint esnext:true*/
/*exported BinaryUtils*/
'use strict';

module.exports = (function() {

	const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
	Cu.importGlobalProperties(["Blob"]);

	var BinaryUtils = {
		stringToArrayBuffer: function(string) {
			var length = (string || '').length;
			var arrayBuffer = new ArrayBuffer(length);
			var uint8Array = new Uint8Array(arrayBuffer);
			for (var i = 0; i < length; i++) {
				uint8Array[i] = string.charCodeAt(i);
			}

			return arrayBuffer;
		},

		arrayBufferToString: function(arrayBuffer) {
			var results = [];
			var uint8Array = new Uint8Array(arrayBuffer);

			for (var i = 0, length = uint8Array.length; i < length; i += 200000) {
				results.push(String.fromCharCode.apply(null, uint8Array.subarray(i, i + 200000)));
			}

			return results.join('');
		},


		mergeArrayBuffers: function(arrayBuffers, callback) {
			var merged = arrayBuffers.reduce((prev, curr) => this.appendBuffer( prev, curr ));

			if (typeof callback === 'function') callback(merged);

			return merged;
		},
		appendBuffer: function( buffer1, buffer2 ) {
			var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
			tmp.set( new Uint8Array( buffer1 ), 0 );
			tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
			return tmp.buffer;
		}

		/*
			FileReader is not available to extensions
		  blobToArrayBuffer: function(blob, callback) {
			var fileReader = new FileReader();
			fileReader.onload = function() {
			  if (typeof callback === 'function') {
				callback(fileReader.result);
			  }
			};
			fileReader.readAsArrayBuffer(blob);

			return fileReader.result;
		  },

		  mergeArrayBuffers: function(arrayBuffers, callback) {
			return BinaryUtils.blobToArrayBuffer(new Blob(arrayBuffers), callback);
		  }
		*/
	};

	return BinaryUtils;

})();
