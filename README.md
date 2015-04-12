Omniscience
======

Firefox extension to find and interact with UPnP (chromecast, matchstick, firetv stick, xbox 360, xbox one, etc..) devices on your local network

How To Run
 CFX

	--CFX is the old/current way of building/testing addons it uses python and you need to run activate first to be able to run cfx commands
	--cfx run opens a new browser with a brand new profile
	--cfx xpi builds the xpi file
	--I have added the addonsdk/bin to my path so the "activate" command works anywhere in the command prompt

	activate
	cfx run -b "C:\program files\nightly\firefox.exe"
		--On my desktop something happened awhile back and I need to specify the binary, with the -b flag
		--Needs to be run from the root of your addon
JPM

	--JPM is the new way of building/testing addons and uses node.
	--Can be installed with npm
	--if node is in your path you are good to go
	--Needs to be run from the root of your addon

	jpm run -b "C:\program files\nightly\firefox.exe" -p ExtensionDev --debug
    jpm run -b "C:\program files\nightly\firefox.exe" -p dev-edition-default --debug
		-p ExtensionDev is telling it to use my existing profile with the name ExtensionDev.  This is significantly better than CFX which allows specifying profiles but you have to do it by path not name
			Also note that it will copy that profile and you will use a copy of the profile which will be destroyed when you close the window.  Your original profile will not be touched
		--debug tells it to start with the addon debugger open

	--to use either of the below two commands you will either need linux/mac or Cygwin.  I used Cygwin (install Cygwin then inside of the Cygwin module selector search for wget and install it)
	--You will also need the extension auto installer
	jpm post --post-url http://localhost:8888/
		--builds an xpi then posts it localhost:8888 if the extension auto installer is running and listening on that port it will auto install/update the extension for you

	jpm watchpost --post-url http://localhost:8888/
		--watches for files to change when they do it auto builds and posts the xpi.  I could not get this to work in Cgywin

Obscure Devtools settings - https://developer.mozilla.org/en-US/docs/Tools/Remote_Debugging/Firefox_for_Metro
	devtools.debugger.force-local = false (if you want to connect from a different machine over the network)
	devtools.debugger.remote-host (to change the TCP hostname where Firefox will listen for connections)
	devtools.debugger.remote-port (to change the TCP port number where Firefox will listen for connections)
	devtools.debugger.prompt-connection = false (Allow connections without displaying a confirmation prompt.  This can be a security risk, especially if you also set the force-local preference to false.)

    javascript.options.showInConsole = true. Logs errors in chrome files to the Error Console.
    nglayout.debug.disable_xul_cache = true. Disables the XUL cache so that changes to windows and dialogs do not require a restart. This assumes you're using directories rather than JARs. Changes to XUL overlays will still require reloading of the document overlaid.
    browser.dom.window.dump.enabled = true. Enables the use of the dump() statement to print to the standard console. See window.dump for more info. You can use nsIConsoleService instead of dump() from a privileged script.
    javascript.options.strict = true. Enables strict JavaScript warnings in the Error Console. Note that since many people have this setting turned off when developing, you will see lots of warnings for problems with their code in addition to warnings for your own extension. You can filter those with Console2.
    devtools.chrome.enabled = true. This enables to run JavaScript code snippets in the chrome context of the Scratchpad from the Tools menu. Don't forget to switch from content to browser as context.
    devtools.debugger.remote-enabled = true. This adds a "Browser Debugger" entry to the "Web Developer" submenu of the "Tools" menu.  The Browser Debugger can be used to debug the JavaScript code of extensions. The devtools.chrome.enabled preference must also be set to true for the Browser Debugger to be enabled.
    extensions.logging.enabled = true. This will send more detailed information about installation and update problems to the Error Console. (Note that the extension manager automatically restarts the application at startup sometimes, which may mean you won't have time to see the messages logged before the automatic restart happens. To see them, prevent the automatic restart by setting the environment NO_EM_RESTART to 1 before starting the application.)
    nglayout.debug.disable_xul_fastload = true. For Gecko 2.0+ (Firefox 4.0+). See this bug for more information. Although the bug has been closed, it is believed that this pref is still relevant.
    You might also want to set dom.report_all_js_exceptions = true. See Exception logging in JavaScript for details.
    devtools.errorconsole.deprecation_warnings = true. Detect deprecated code use.
https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment

View contents of simplestorage

	--From addon-debugger console run
		loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage

TroubleShooting Tips
	If you are having problems with the fxoswebserver check for casing mismatch issues.  I had an issue
	where the header was coming in as CONTENT-LENGTH but the code was looking for Content-Length.

To-Do

	[ ]	New Icon

	Front-End

		Panel
			[ ] re-enable, maybe under a second button
			[ ] Start with list of devices
			[ ] Clicking on device will slide either right or left to the playlist for the device
			[ ] Indicate if something is playing currently on the device

		Device Template

			Header Media Controls
				[ ] Time slider allows to seek
				[ ] Show only play or pause

			Playlist
				[ ] Navigating away from page and back shouldn't lose the list
				[ ] Show metadata info if available
				[ ] Drag and Drop re-order
				[ ] Limit to mediums supported on device (if device only supports audio only allow users to add audio file types) same for video and images
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
					[ ] Display return values

			Info
				[ ] Clean up
				[ ] Better display for not implemented values
				[ ] Add refresh button to each section?
				[ ] Parse "Protocol Info" under "Current Connection Info"

			[ ] Find a way to not duplicate name/icon of device from upper left to the center top of page
				Currently does this because if there are links to the device, device model, or manufacturer they are only shown in the top center of page
			[ ] Intelligently pick which icon to show - currently it shows first, probably choose biggest png
			[ ] Add ability to change device settings on settings tab
			[ ] Increase usability on smaller screen sizes - phone/tablet/desktop (phone would look like the panel)

		About Page
			[ ] Make it

		Better error handling

	Back-End

		HTTP Server
			[ ] Use fxos-web-server for serving the files
			[ ] Remove httpd
			[ ] Fix issue with xbox 360 restarting audio files from begining a few seconds in

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
			[ ] Fix notifications appearing off screen problem
			[ ] Group notifications together because a new notification will not be shown if one already is, and many notifications in a short period of time is annoying
			[ ] Add setting to disable notifications
			[ ] Re-enable
			[ ] Show notifications for new files playing as well as new devices found

		Constants
			[ ] Move more strings into this file.

		[ ] Make a logger that can take different levels (info, warn, error) and allow user to pick verbosity.
		[ ] Get metadata for files
		[ ] Add ffmpegjs and attempt to change container if container is unsupported but underlying codecs are supported
		[ ] Better error handling
		[ ] Better understand/remove TransportService

matchstick, chromecast, and firestick will need extra setup in the new service oriented arch.  They will need to setup a service on the device in the device factory of themselves


Need to find a way to add manufacturer specific methods to services
There is a more fool-proof way to compare if the devices are the same, not sure what it is -maybe the uu
id of the device, but the intel upnp tools device spy can tell when it is the same device just on a different network interface
intel upnp tools, network light doesn't show methods or properties but it definitely has them.