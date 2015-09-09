Omniscience
======

Firefox Extension/Chrome App to find and interact with UPnP (chrome-cast, matchstick, firetv stick, xbox 360, xbox one, etc..) devices on your local network

##Prerequisites:

1. Recent version of Node
2. babel, babelify, browserify, eslint, jasmine, jpm

	`npm install babel babelify browserify eslint jasmine jpm -g`

##How To:
###Build
(From root of soln)

`npm install`

Then run one of the below build commands

`npm run build` -- build for all environments

`npm run build:chrome` -- build for Chrome

`npm run build:firefox` -- build for Firefox

`npm run build:cordova` -- build for Cordova

`npm run xpi` -- build installer for Firefox

###Run Tests
`npm run test`

`npm run lint`

###Run
####Chrome
1. Build using instructions above
2. Go to [chrome://extensions](chrome://extensions)
3. Check the Developer Mode box
4. Click Load unpacked extension
5. Select the root of the soln
6. Click Launch

####Firefox
1. Build using instructions above
2. Install the [Extension Auto Installer](https://addons.mozilla.org/en-us/firefox/addon/autoinstaller/)
3. Change the port it listens on to 7999
4. run `npm run buildpost` or `npm run post`
	* buildpost runs `npm build:firefox` then `npm run post`

###View contents of simplestorage
From addon-debugger console run `loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage`

###Connect to MatchStick for debugging purposes
1. `adb connect IP_OF_DEVICE_HERE`
2. `adb devices`
	* You should see your device, mine just shows as device
3. open WebIDE and it should be listed under runtimes > usb devices
###Firefox [about:config](about:config) changes:
	name: extensions.jid1-A3BeMgzQQjOvNg@jetpack.sdk.console.logLevel
	value: all
	name: xpinstall.signatures.required
	value: false