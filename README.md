Rotary
======

Extension to find and interact with DIAL (chromecast, matchstick) devices on your local network


todo:
    New Name
    New Icon
    Better understand Module/Export pattern
    
    Front-End
        Panel
            re-enable, maybe under a second button
            Start with list of devices
            Clicking on device will slide either right or left to the playlist for the device
            Indicate if something is playing currently on the device
        Device Template
            Header Media Controls
                Current/total duration
                Time slider shows current duration
                Time slider allows to seek
                Show current media info (at least file name/title)
                Show only play or pause
                Fix button disabling logic
            Playlist
                Auto play next
                Navigating away from page and back shouldn't lose the list
                File path input readonly
                click on play/add to playlist where fields are empty/invalid won't add blank to playlist
                Show metadata info if available
                Drag and Drop re-order
            Break apart with ui router
            Find a way to not duplicate name/icon of device from upper left to the center top of page
                currently does this as if there are links to the device, device model, manufacturer they are shown in the top center of page
            Intelligently pick which icon to show - currently it shows first, probably choose biggest png
            Add control of device settings under settings tab
            Clean up device info tab
            Fix popovers not rendering - one liner needs to be fired after jquery and others load, which are dynamically loaded from the back-end
            Increase usability on smaller screen sizes - probably a phone/tablet/desktop (phone would look like the panel)
        Home Template
            Show a grid of devices
            Show message if no devices found
        About Page
            Create
        Add UI Router
        Better error handling
    Back-End
        HTTP Server
            Fix the fxos-web-server so it works in extension context or remove it
            Remove httpd
            Do not route non-local files through current computer - currently all files including ones added via url get a url on the current machine and routed through it.
            Fix issue with xbox 360 restarting audio files from begining a few seconds in
            Do no re-map already mapped files
            Add guid folder to path of mapped files so files with the same name can co-exist
        DLNA
            Add/Merge sub-devices from devicelist xml
            Support (un)Subscribe Events
                Get current duration
                Get total duration
            Get/Set Volume
            Get/Set Mute
            Seek
            Send metadata to device
            Remove hardcoded instance ids and other hardcoded options that seem to never change
        Devices
            Fix and re-enable the logging of unknown devices
            Better understand DIAL spec - I should be able to use it to launch an app on the device, and I believe I can pass in some extra data.
                            If true I should be able to make a websocketserver in the extension and pass the path to communicate with the app on the device.  
                            This would help to unify the implementation across devices.
            Support for FireTV Stick
            Support for MatchStick
                Support configuring unsetup devices
                re-write their sender daemon into something more sane and robust
            Support for Chromecast
                Support configuring unsetup devices
            Support DLNA media servers            
        Notifications
            Fix notifications appearing off screen problem
            Group notifications together because a new notification will not be shown if one already is, and many notifications in a short period of time are annoying
            Add setting to disable notifications
            Re-enable
            Show notifications for new files playing as well as new devices found
        Searching
            Allow to search for devices on an interval
        Get metadata for files
        Replace my custom string.format with ES6 template strings
        Inject more dependencies
        Add ffmpegjs and attempt to change container if container is unsupported but underlying codecs are supported
        Better error handling
        Better understand/remove TransportService