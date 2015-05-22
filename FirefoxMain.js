var button;
/**
 * extension startup
 */
module.exports.main = function main() {
    const CompositionRoot = require('./CompositionRoot');
    var compositionRoot = new CompositionRoot();

    compositionRoot.createDeviceLocator().then( (deviceLocator) => {
    	button = compositionRoot.createButton();
    	compositionRoot.createTab();
    });
};
/**
 * extension shutdown
 */
module.exports.onUnload = function onUnload() {
	if(button) button.remove();
    //todo: loop over devices and unsubscribe from all events
};
