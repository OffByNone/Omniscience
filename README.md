Omniscience
======

Firefox extension to find and interact with UPnP (chromecast, matchstick, firetv stick, xbox 360, xbox one, etc..) devices on your local network

How To Run
CFX Firefox for Android

    cfx run -b "c:\Program Files (x86)\Android\android-sdk\platform-tools\adb.exe" -a fennec-on-device --force-mobile
        this requires an android device to be attached via usb and for adb to be installed, running, and able to see the device
        -b path-to-adb
        -a app-to-run

JPM

	--Installed with npm
	--Needs to be run from the root of your addon

	jpm run -b "C:\program files\nightly\firefox.exe" -p ExtensionDev --debug
		-p ExtensionDev is telling it to use my existing profile with the name ExtensionDev.
			Note that it will copy that profile and you will use a copy of the profile which will be destroyed when you close the window.  Your original profile will not be touched
		--debug tells it to start with the addon debugger open

	--You will also need the extension auto installer
	jpm post --post-url http://localhost:8888/
		--builds an xpi then posts it localhost:8888 if the extension auto installer is running and listening on that port it will auto install/update the extension for you

	jpm watchpost --post-url http://localhost:8888/
		--watches for files to change when they do it auto builds and posts the xpi.  I could not get this to work in Cgywin

	devtools.debugger.force-local = false (if you want to connect from a different machine over the network)
	devtools.debugger.remote-host (to change the TCP hostname where Firefox will listen for connections)
	devtools.debugger.remote-port (to change the TCP port number where Firefox will listen for connections)
	devtools.debugger.prompt-connection = false (Allow connections without displaying a confirmation prompt.  This can be a security risk, especially if you also set the force-local preference to false.)

Debug Node unit tests
	node --debug-brk node_modules/jasmine/bin/jasmine.js spec\UnitTestFileHere.js
Istanbul code coverage
    istanbul cover node_modules/jasmine/bin/jasmine.js


View contents of simplestorage

	--From addon-debugger console run
		loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage

Connect to MatchStick for debugging purposes


	adb connect [ip]:5555 (5555 is default so you should be able to omit the port, ip is the ip of your device)
	adb devices (you should see your device, mine just shows as device)
	open webide and it should be listed under usb devices

To-Do


	Front-End

		Device Template

			Media Controls
				[ ] Time slider allows to seek

			Playlist
				[ ] Navigating away from page and back shouldn't lose the list
				[ ] Show metadata info if available
				[ ] Drag and Drop re-order
				[ ] Limit to mediums supported on device (if device only supports audio, only allow users to add audio file types) same for video and images
				[ ] Adding a folder should cause all items in said folder to get added.

			Services
				Properties
					[ ] Clean up possible values
					[ ] Clean up range
					[ ] Create legend
					[ ] Show current value (if possible)
				Methods
					[ ] Clean up hover for parameters
					[ ] Better display related properties
					[ ] If property is known (ex. instanceid is almost always 0 and we can determine this) somehow display to user

			[ ] Intelligently pick which icon to show - currently it shows first, probably choose biggest png

		About Page
			[ ] Make it

	Back-End

		mDNS
		DLNA
			[ ] Add/Merge sub-devices from devicelist xml
			[ ] Seek
			[ ] Send metadata to device
			[ ] Remove hardcoded instance ids and other hardcoded options that seem to never change

		Devices
			[ ] Better understand DIAL spec - I should be able to use it to launch an app on the device, and I believe I can pass in some extra data.
							If true I should be able to make a websocketserver in the extension and pass the url of said server to communicate with the app on the device.
							This would help to unify the implementation across devices.
			[ ] Support for FireTV Stick
			[ ] Support for MatchStick
				[ ] Support configuring unsetup devices
				[ ] re-write their sender daemon into something more sane and robust
			[ ] Support for Chromecast
				[ ] Support configuring unsetup devices

		Notifications
			[ ] Group notifications together because a new notification will not be shown if one already is, and many notifications in a short period of time is annoying
			[ ] Add setting to disable notifications

		[ ] Make a logger that can take different levels (info, warn, error) and allow user to pick verbosity.
		[ ] Get metadata for files
		[ ] Add ffmpegjs and attempt to change container if container is unsupported but underlying codecs are supported
		[ ] Better error handling

Save found devices in case user is in a situation where only the passive searcher works.  If we didn't save devices closing and re-opening the browser would lose all devices and potentially take hours to find any given device again