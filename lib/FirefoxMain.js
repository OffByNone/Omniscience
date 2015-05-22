var button;
/**
 * extension startup
 */
module.exports.main = function main() {
	const CompositionRoot = require('./CompositionRoot');
	const AddonSdk = require('./SDK/AddonSdk');
	var compositionRoot = new CompositionRoot(AddonSdk);

    compositionRoot.createDeviceLocator().then(() => {
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
