Rotary
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
		--On my desktop something happened awhile back and I need to specify the binary, a reinstall of firefox would likely fix the issue and maybe someday I will do it but for now I just specify the binary manually with the -b flag 
		--Needs to be run from the root of your addon
JPM

	--JPM is the new way of building/testing addons and uses node.
	--Can be installed with npm
	--if node is in your path you are good to go
	--Needs to be run from the root of your addon

	jpm run -b "C:\program files\nightly\firefox.exe" -p ExtensionDev --debug
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


View contents of simplestorage

	--From addon-debugger console run
		loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage

Better work flow for working on the tab

	Using cfx -or even JPM- isn't the best workflow as having to restart the browser to test a change takes awhile - the JPM is far slower than CFX and the JPM post isn't much if any faster than a cfx run.
	In order to get around this when I have been working on the tab I have been loading it via a local file server as just a normal html file.
	To do this requires a few changes to the files:
		Make sure all the devices are found and run the extension and put a breakpoint inside of main.js where it is sending the updatedevice message to the panel/tab (as of this writing it is around line 77).
		Run the following command in the addon-debugger window while paused at the breakpoint: JSON.stringify(deviceLocatorService.devices)
		There will likely be a [...] somewhere in the output make sure to click that to expand so you can see the entire output
		Copy the output, and paste into your favorite editor
		Remove the first and last '"'
		You should now have an array of your device objects, replace the testdevices array inside of data/UI/tab.js
		Open data/UI/index.html and un-comment the script files at the bottom - these might be out of date to update them look at the Constants file and find the contentscriptfiles for the tab, and make sure to add the data/ui/tab.js at the top of this block
		Open DeviceController.js and HomeController.js and add "window.loadDevices()" as the final line before the final "});"
		Find a static file server and fire it up - I use the node serve-static
		Navigate to the tab page in your browser and you should be good to develop it like a normal website.

	Make sure to remove the window.loadDevices() and re-comment out the script files when you want to load it from the extension again or when you are done.

TroubleShooting Tips
    If you are having problems with the fxoswebserver check for casing mismatch issues.  I had an issue
    where the header was coming in as CONTENT-LENGTH but the code was looking for Content-Length.

To-Do

	[ ]	New Icon
	[ ] Better understand Module/Export pattern

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
				[ ] Limit file types to supported types on the device

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

            [ ] Break apart with ui router
            [ ] Find a way to not duplicate name/icon of device from upper left to the center top of page
                Currently does this because if there are links to the device, device model, or manufacturer they are only shown in the top center of page
            [ ] Intelligently pick which icon to show - currently it shows first, probably choose biggest png
            [ ] Add ability to change device settings on settings tab
            [ ] Increase usability on smaller screen sizes - phone/tablet/desktop (phone would look like the panel)

        About Page
            [ ] Make it

        Add UI Router
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
			[ ] Fix serviceTypes and deviceTypes.

        [ ] Make a logger that can take different levels (info, warn, error) and allow user to pick verbosity.
        [ ] Get metadata for files
        [ ] Inject more dependencies
        [ ] Add ffmpegjs and attempt to change container if container is unsupported but underlying codecs are supported
        [ ] Better error handling
        [ ] Better understand/remove TransportService