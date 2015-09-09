Omniscience
======

Firefox Extension/Chrome App to find and interact with UPnP (chromecast, matchstick, firetv stick, xbox 360, xbox one, etc..) devices on your local network

##Prerequisites:

1. Recent version of Node
2. babel, babelify, browserify, eslint, jasmine, jpm

    `npm install babel babelify browserify eslint jasmine jpm -g`

##How To:
###Build
(From root of soln)

`npm run build`

or `npm run build:chrome`

or `npm run build:firefox`

or `npm run build:cordova`

or `npm run xpi`

###Run Tests
`npm run test`

`npm run lint`

###Run
####Chrome
1. Go to chrome://extensions
2. Check the Developer Mode box
3. Click Load unpacked extension
4. Select the root of the soln
5. Click Launch

####Firefox
1. Install the Extension Auto Installer from addons.mozilla.org
2. Change the port it listens on to 7999
3. run `npm run buildpost` or `npm run post`

###View contents of simplestorage
	From addon-debugger console run
		loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage

###Connect to MatchStick for debugging purposes
	adb connect ip:5555 (5555 is default so you should be able to omit the port, ip is the ip of your device)
	adb devices (you should see your device, mine just shows as device)
	open webide and it should be listed under usb devices
###Firefox about:config changes:
	name: extensions.jid1-A3BeMgzQQjOvNg@jetpack.sdk.console.logLevel
	value: all
	name: xpinstall.signatures.required
	value: false