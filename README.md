Omniscience
======

Firefox Extension/Chrome App to find and interact with UPnP (chromecast, matchstick, firetv stick, xbox 360, xbox one, etc..) devices on your local network

How To:

	Run

		install jpm
		navigate to root of addon
		jpm run -p ExtensionDev --debug

		-p ExtensionDev is telling it to use my existing profile with the name ExtensionDev.
			Note that it will copy that profile and you will use a copy of the profile which will be destroyed when you close the window.  Your original profile will not be touched
		--debug tells it to start with the addon debugger open

		on windows environment variable JPM_FIREFOX_BINARY controls default binary to execute

	Debug Node unit tests
		node --debug-brk node_modules/jasmine/bin/jasmine.js spec\UnitTestFileHere.js
	Istanbul code coverage
		istanbul cover node_modules/jasmine/bin/jasmine.js

	View contents of simplestorage
		From addon-debugger console run
			loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage

	Connect to MatchStick for debugging purposes
		adb connect ip:5555 (5555 is default so you should be able to omit the port, ip is the ip of your device)
		adb devices (you should see your device, mine just shows as device)
		open webide and it should be listed under usb devices
	When using pre-existing profile console.log statements from addon will not be shown.  To enable add key to about:config with
		name: extensions.jid1-A3BeMgzQQjOvNg@jetpack.sdk.console.logLevel
		value: all


Commands to Build

	npm run build
	npm run buildpost
	npm run post