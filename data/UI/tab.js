(function(){
    if(!window.self.port){
        window.self.port = {
            on: function(eventType, callback){
                document.addEventListener(eventType, function(e){callback(e.detail);});
            }, 
            emit: function(eventType, data){
                document.dispatchEvent(new CustomEvent(eventType, { 'detail': data }));
            }
        };

        window.testing = true;
        window.setTimeout(() => {
            var testDevices = [{"audioCapable":false,"videoCapable":false,"mirrorCapable":false,"serviceKey":"genericDeviceService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"udn":"uuid:41cf7512-c290-4bff-82bf-962e4cab1c26","friendlyname":"TOSHIBA: PJ:","devicetype":"urn:schemas-upnp-org:device:MediaServer:1","manufacturer":"Microsoft Corporation","manufacturerurl":"http://www.microsoft.com","modelname":"Windows Media Player Sharing","modelnumber":12,"modelurl":"http://go.microsoft.com/fwlink/?LinkId=105926","serialnumber":"S-1-5-21-3493001740-195389577-1747714056-1001","iconlist":{"icon":[{"mimetype":"image/jpeg","width":120,"height":120,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:81ffea67-33ce-4f6a-a9ca-e16976bb19ea"},{"mimetype":"image/png","width":120,"height":120,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:414af563-87b6-41d6-8028-e533022ccb35"},{"mimetype":"image/jpeg","width":48,"height":48,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:6b92dbaa-6236-41d3-bd32-7265c4ad31bf"},{"mimetype":"image/png","width":48,"height":48,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:98bed58d-a54e-4827-a6e3-9cb5a349ea45"},{"mimetype":"image/bmp","width":48,"height":48,"depth":16,"url":"/upnphost/udhisapi.dll?content=uuid:06037b44-28a4-4546-b2c3-535205adcd90"},{"mimetype":"image/jpeg","width":32,"height":32,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:d38f7382-aeb0-4cb4-b1f1-4af316d68e45"},{"mimetype":"image/bmp","width":32,"height":32,"depth":16,"url":"/upnphost/udhisapi.dll?content=uuid:a32fd052-a883-45f9-b74b-df97db4c21f8"}]},"servicelist":{"service":[{"servicetype":"urn:schemas-upnp-org:service:ConnectionManager:1","serviceid":"urn:upnp-org:serviceId:ConnectionManager","controlurl":"/upnphost/udhisapi.dll?control=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ConnectionManager","eventsuburl":"/upnphost/udhisapi.dll?event=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ConnectionManager","scpdurl":"/upnphost/udhisapi.dll?content=uuid:62025892-f37c-4d1c-a921-61207bc79547"},{"servicetype":"urn:schemas-upnp-org:service:ContentDirectory:1","serviceid":"urn:upnp-org:serviceId:ContentDirectory","controlurl":"/upnphost/udhisapi.dll?control=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ContentDirectory","eventsuburl":"/upnphost/udhisapi.dll?event=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ContentDirectory","scpdurl":"/upnphost/udhisapi.dll?content=uuid:f6b1245d-00f6-4538-9524-d3eac1059c4b"},{"servicetype":"urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1","serviceid":"urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","controlurl":"/upnphost/udhisapi.dll?control=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","eventsuburl":"/upnphost/udhisapi.dll?event=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","scpdurl":"/upnphost/udhisapi.dll?content=uuid:f6859863-2ace-4e2e-8789-eb64c3f56484"}]}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.21:2869/","upnpVersion":"1.0","serialNumber":"S-1-5-21-3493001740-195389577-1747714056-1001","type":{"urn":"urn:schemas-upnp-org:device:MediaServer:1","name":"Media Server"},"name":"TOSHIBA: PJ:","manufacturer":{"name":"Microsoft Corporation","url":"http://www.microsoft.com"},"model":{"number":12,"name":"Windows Media Player Sharing","url":"http://go.microsoft.com/fwlink/?LinkId=105926","udn":"uuid:41cf7512-c290-4bff-82bf-962e4cab1c26"},"icons":[{"mimeType":"image/jpeg","width":120,"height":120,"depth":24,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:81ffea67-33ce-4f6a-a9ca-e16976bb19ea"},{"mimeType":"image/png","width":120,"height":120,"depth":24,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:414af563-87b6-41d6-8028-e533022ccb35"},{"mimeType":"image/jpeg","width":48,"height":48,"depth":24,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:6b92dbaa-6236-41d3-bd32-7265c4ad31bf"},{"mimeType":"image/png","width":48,"height":48,"depth":24,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:98bed58d-a54e-4827-a6e3-9cb5a349ea45"},{"mimeType":"image/bmp","width":48,"height":48,"depth":16,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:06037b44-28a4-4546-b2c3-535205adcd90"},{"mimeType":"image/jpeg","width":32,"height":32,"depth":24,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:d38f7382-aeb0-4cb4-b1f1-4af316d68e45"},{"mimeType":"image/bmp","width":32,"height":32,"depth":16,"url":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:a32fd052-a883-45f9-b74b-df97db4c21f8"}],"services":[{"controlUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?control=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ConnectionManager","eventSubUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?event=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ConnectionManager","scpdUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:62025892-f37c-4d1c-a921-61207bc79547","id":"urn:upnp-org:serviceId:ConnectionManager","type":{"urn":"urn:schemas-upnp-org:service:ConnectionManager:1","name":"Connection Manager"}},{"controlUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?control=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ContentDirectory","eventSubUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?event=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:upnp-org:serviceId:ContentDirectory","scpdUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:f6b1245d-00f6-4538-9524-d3eac1059c4b","id":"urn:upnp-org:serviceId:ContentDirectory","type":{"urn":"urn:schemas-upnp-org:service:ContentDirectory:1","name":"Content Directory"}},{"controlUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?control=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","eventSubUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?event=uuid:41cf7512-c290-4bff-82bf-962e4cab1c26+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","scpdUrl":"http://192.168.1.21:2869/upnphost/udhisapi.dll?content=uuid:f6859863-2ace-4e2e-8789-eb64c3f56484","id":"urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","type":{"urn":"urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1","name":"Media Receiver Registrar"}}]},
                               {"audioCapable":false,"videoCapable":false,"mirrorCapable":false,"serviceKey":"genericDeviceService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:schemas-wifialliance-org:device:WFADevice:1","friendlyname":"ASUS WPS Router","manufacturer":"ASUSTeK Corporation","manufacturerurl":"http://www.asus.com","modeldescription":"ASUS WPS Router","modelname":"WPS Router","modelnumber":"X1","serialnumber":1,"udn":"uuid:de66ab88-4bf8-e494-5d03-1c515f227222","servicelist":{"service":{"servicetype":"urn:schemas-wifialliance-org:service:WFAWLANConfig:1","serviceid":"urn:wifialliance-org:serviceId:WFAWLANConfig1","scpdurl":"/x_wfawlanconfig.xml","controlurl":"/control?WFAWLANConfig","eventsuburl":"/event?WFAWLANConfig"}}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.1:1990/","upnpVersion":"1.0","serialNumber":1,"type":{"urn":"urn:schemas-wifialliance-org:device:WFADevice:1","name":"WFA"},"name":"ASUS WPS Router","manufacturer":{"name":"ASUSTeK Corporation","url":"http://www.asus.com"},"model":{"number":"X1","description":"ASUS WPS Router","name":"WPS Router","udn":"uuid:de66ab88-4bf8-e494-5d03-1c515f227222"},"icons":[],"services":[{"controlUrl":"http://192.168.1.1:1990/control?WFAWLANConfig","eventSubUrl":"http://192.168.1.1:1990/event?WFAWLANConfig","scpdUrl":"http://192.168.1.1:1990/x_wfawlanconfig.xml","id":"urn:wifialliance-org:serviceId:WFAWLANConfig1","type":{"urn":"urn:schemas-wifialliance-org:service:WFAWLANConfig:1","name":"WFA WLAN Config"}}]},
                               {"audioCapable":false,"videoCapable":false,"mirrorCapable":false,"serviceKey":"genericDeviceService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:schemas-upnp-org:device:InternetGatewayDevice:1","friendlyname":"RT-AC66R","manufacturer":"ASUSTeK Computer Inc.","manufacturerurl":"http://www.asus.com","modeldescription":"RT-AC66R","modelname":"RT-AC66R","modelnumber":"3.0.0.4.376","modelurl":"http://www.asus.com","serialnumber":"CAIAA2000001","udn":"uuid:4bc21797-47af-428a-bec7-cf3f0fc8452f","servicelist":{"service":{"servicetype":"urn:schemas-upnp-org:service:Layer3Forwarding:1","serviceid":"urn:upnp-org:serviceId:Layer3Forwarding1","controlurl":"/ctl/L3F","eventsuburl":"/evt/L3F","scpdurl":"/L3F.xml"}},"devicelist":{"device":{"devicetype":"urn:schemas-upnp-org:device:WANDevice:1","friendlyname":"WANDevice","manufacturer":"MiniUPnP","manufacturerurl":"http://miniupnp.free.fr/","modeldescription":"WAN Device","modelname":"WAN Device","modelnumber":1.4,"modelurl":"http://miniupnp.free.fr/","serialnumber":"CAIAA2000001","udn":"uuid:4bc21797-47af-428a-bec7-cf3f0fc8452f","upc":"MINIUPNPD","servicelist":{"service":{"servicetype":"urn:schemas-upnp-org:service:WANCommonInterfaceConfig:1","serviceid":"urn:upnp-org:serviceId:WANCommonIFC1","controlurl":"/ctl/CmnIfCfg","eventsuburl":"/evt/CmnIfCfg","scpdurl":"/WANCfg.xml"}},"devicelist":{"device":{"devicetype":"urn:schemas-upnp-org:device:WANConnectionDevice:1","friendlyname":"WANConnectionDevice","manufacturer":"MiniUPnP","manufacturerurl":"http://miniupnp.free.fr/","modeldescription":"MiniUPnP daemon","modelname":"MiniUPnPd","modelnumber":1.4,"modelurl":"http://miniupnp.free.fr/","serialnumber":"CAIAA2000001","udn":"uuid:4bc21797-47af-428a-bec7-cf3f0fc8452f","upc":"MINIUPNPD","servicelist":{"service":{"servicetype":"urn:schemas-upnp-org:service:WANIPConnection:1","serviceid":"urn:upnp-org:serviceId:WANIPConn1","controlurl":"/ctl/IPConn","eventsuburl":"/evt/IPConn","scpdurl":"/WANIPCn.xml"}}}}}},"presentationurl":"http://192.168.1.1"},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.1:44417/","upnpVersion":"1.0","serialNumber":"CAIAA2000001","webPage":"http://192.168.1.1","type":{"urn":"urn:schemas-upnp-org:device:InternetGatewayDevice:1","name":"Internet Gateway"},"name":"RT-AC66R","manufacturer":{"name":"ASUSTeK Computer Inc.","url":"http://www.asus.com"},"model":{"number":"3.0.0.4.376","description":"RT-AC66R","name":"RT-AC66R","url":"http://www.asus.com","udn":"uuid:4bc21797-47af-428a-bec7-cf3f0fc8452f"},"icons":[],"services":[{"controlUrl":"http://192.168.1.1:44417/ctl/L3F","eventSubUrl":"http://192.168.1.1:44417/evt/L3F","scpdUrl":"http://192.168.1.1:44417/L3F.xml","id":"urn:upnp-org:serviceId:Layer3Forwarding1","type":{"urn":"urn:schemas-upnp-org:service:Layer3Forwarding:1","name":"Layer 3 Forwarding"}}]},
                               {"audioCapable":false,"videoCapable":false,"mirrorCapable":false,"serviceKey":"genericDeviceService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:schemas-upnp-org:device:MediaServer:1","friendlyname":"RT-AC66R-76E0","manufacturer":"ASUSTeK Computer Inc.","manufacturerurl":"http://www.asus.com/","modeldescription":"MiniDLNA on asuswrt","modelname":"Windows Media Connect compatible","modelnumber":"3.0.0.4.376","modelurl":"http://www.asus.com/","serialnumber":"e0:3f:49:9d:76:e0","udn":"uuid:4d696e69-444c-164e-9d41-c4544483e8d8","presentationurl":"http://192.168.1.1:80/","iconlist":{"icon":[{"mimetype":"image/png","width":48,"height":48,"depth":24,"url":"/icons/sm.png"},{"mimetype":"image/png","width":120,"height":120,"depth":24,"url":"/icons/lrg.png"},{"mimetype":"image/jpeg","width":48,"height":48,"depth":24,"url":"/icons/sm.jpg"},{"mimetype":"image/jpeg","width":120,"height":120,"depth":24,"url":"/icons/lrg.jpg"}]},"servicelist":{"service":[{"servicetype":"urn:schemas-upnp-org:service:ContentDirectory:1","serviceid":"urn:upnp-org:serviceId:ContentDirectory","controlurl":"/ctl/ContentDir","eventsuburl":"/evt/ContentDir","scpdurl":"/ContentDir.xml"},{"servicetype":"urn:schemas-upnp-org:service:ConnectionManager:1","serviceid":"urn:upnp-org:serviceId:ConnectionManager","controlurl":"/ctl/ConnectionMgr","eventsuburl":"/evt/ConnectionMgr","scpdurl":"/ConnectionMgr.xml"},{"servicetype":"urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1","serviceid":"urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","controlurl":"/ctl/X_MS_MediaReceiverRegistrar","eventsuburl":"/evt/X_MS_MediaReceiverRegistrar","scpdurl":"/X_MS_MediaReceiverRegistrar.xml"}]}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.1:8200/","upnpVersion":"1.0","serialNumber":"e0:3f:49:9d:76:e0","webPage":"http://192.168.1.1:80/","type":{"urn":"urn:schemas-upnp-org:device:MediaServer:1","name":"Media Server"},"name":"RT-AC66R-76E0","manufacturer":{"name":"ASUSTeK Computer Inc.","url":"http://www.asus.com/"},"model":{"number":"3.0.0.4.376","description":"MiniDLNA on asuswrt","name":"Windows Media Connect compatible","url":"http://www.asus.com/","udn":"uuid:4d696e69-444c-164e-9d41-c4544483e8d8"},"icons":[{"mimeType":"image/png","width":48,"height":48,"depth":24,"url":"http://192.168.1.1:8200/icons/sm.png"},{"mimeType":"image/png","width":120,"height":120,"depth":24,"url":"http://192.168.1.1:8200/icons/lrg.png"},{"mimeType":"image/jpeg","width":48,"height":48,"depth":24,"url":"http://192.168.1.1:8200/icons/sm.jpg"},{"mimeType":"image/jpeg","width":120,"height":120,"depth":24,"url":"http://192.168.1.1:8200/icons/lrg.jpg"}],"services":[{"controlUrl":"http://192.168.1.1:8200/ctl/ContentDir","eventSubUrl":"http://192.168.1.1:8200/evt/ContentDir","scpdUrl":"http://192.168.1.1:8200/ContentDir.xml","id":"urn:upnp-org:serviceId:ContentDirectory","type":{"urn":"urn:schemas-upnp-org:service:ContentDirectory:1","name":"Content Directory"}},{"controlUrl":"http://192.168.1.1:8200/ctl/ConnectionMgr","eventSubUrl":"http://192.168.1.1:8200/evt/ConnectionMgr","scpdUrl":"http://192.168.1.1:8200/ConnectionMgr.xml","id":"urn:upnp-org:serviceId:ConnectionManager","type":{"urn":"urn:schemas-upnp-org:service:ConnectionManager:1","name":"Connection Manager"}},{"controlUrl":"http://192.168.1.1:8200/ctl/X_MS_MediaReceiverRegistrar","eventSubUrl":"http://192.168.1.1:8200/evt/X_MS_MediaReceiverRegistrar","scpdUrl":"http://192.168.1.1:8200/X_MS_MediaReceiverRegistrar.xml","id":"urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","type":{"urn":"urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1","name":"Media Receiver Registrar"}}]},
                               {"audioCapable":true,"videoCapable":true,"mirrorCapable":false,"serviceKey":"mediaRendererService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:schemas-upnp-org:device:MediaRenderer:1","friendlyname":"STR-DN1040","manufacturer":"Sony Corporation","manufacturerurl":"http://www.sony.net/","modeldescription":"MULTI CHANNEL AV RECEIVER","modelname":"STR-DN1040","modelnumber":"JB3.1.1","udn":"uuid:5f9ec1b3-ed59-1900-4530-d8d43caafb4f","iconlist":{"icon":[{"mimetype":"image/jpeg","width":48,"height":48,"depth":24,"url":"/device_icon_48.jpg"},{"mimetype":"image/jpeg","width":120,"height":120,"depth":24,"url":"/device_icon_120.jpg"},{"mimetype":"image/png","width":48,"height":48,"depth":24,"url":"/device_icon_48.png"},{"mimetype":"image/png","width":120,"height":120,"depth":24,"url":"/device_icon_120.png"}]},"servicelist":{"service":[{"servicetype":"urn:schemas-upnp-org:service:RenderingControl:1","serviceid":"urn:upnp-org:serviceId:RenderingControl","scpdurl":"/RenderingControl/desc.xml","controlurl":"/RenderingControl/ctrl","eventsuburl":"/RenderingControl/evt"},{"servicetype":"urn:schemas-upnp-org:service:ConnectionManager:1","serviceid":"urn:upnp-org:serviceId:ConnectionManager","scpdurl":"/ConnectionManager/desc.xml","controlurl":"/ConnectionManager/ctrl","eventsuburl":"/ConnectionManager/evt"},{"servicetype":"urn:schemas-upnp-org:service:AVTransport:1","serviceid":"urn:upnp-org:serviceId:AVTransport","scpdurl":"/AVTransport/desc.xml","controlurl":"/AVTransport/ctrl","eventsuburl":"/AVTransport/evt"},{"servicetype":"urn:schemas-sony-com:service:Party:1","serviceid":"urn:schemas-sony-com:serviceId:Party","scpdurl":"/Party_scpd.xml","controlurl":"/Party_Control","eventsuburl":"/Party_Event"},{"servicetype":"urn:schemas-sony-com:service:IRCC:1","serviceid":"urn:schemas-sony-com:serviceId:IRCC","scpdurl":"/IRCCSCPD.xml","controlurl":"/upnp/control/IRCC","eventsuburl":"/"}]},"devicelist":{"device":{"devicetype":"urn:schemas-upnp-org:device:Basic:1","friendlyname":"STR_CISIP","manufacturer":"Sony Corporation","manufacturerurl":"http://www.sony.net/","modeldescription":"IPSTR2","modelname":"STR-DN1040","modelnumber":true,"modelurl":"http://www.sony.net/","udn":"uuid:5f9ec1b3-ed59-1900-4531-d8d43caafb4f","servicelist":{"service":{"servicetype":"urn:schemas-sony-com:service:X_CIS:1","serviceid":"urn:schemas-sony-com:serviceId:X_CIS","scpdurl":"CIS_ServiceDescription.xml","controlurl":"/upnp/control/CIS","eventsuburl":"/upnp/event/CIS"}}}},"presentationurl":"http://192.168.1.14"},"@xmlns":"urn:schemas-upnp-org:device-1-0","@xmlns:pnpx":"http://schemas.microsoft.com/windows/pnpx/2005/11","@xmlns:df":"http://schemas.microsoft.com/windows/2008/09/devicefoundation"},"address":"http://192.168.1.14:8080/","upnpVersion":"1.0","webPage":"http://192.168.1.14","type":{"urn":"urn:schemas-upnp-org:device:MediaRenderer:1","name":"Media Renderer"},"name":"STR-DN1040","manufacturer":{"name":"Sony Corporation","url":"http://www.sony.net/"},"model":{"number":"JB3.1.1","description":"MULTI CHANNEL AV RECEIVER","name":"STR-DN1040","udn":"uuid:5f9ec1b3-ed59-1900-4530-d8d43caafb4f"},"icons":[{"mimeType":"image/jpeg","width":48,"height":48,"depth":24,"url":"http://192.168.1.14:8080/device_icon_48.jpg"},{"mimeType":"image/jpeg","width":120,"height":120,"depth":24,"url":"http://192.168.1.14:8080/device_icon_120.jpg"},{"mimeType":"image/png","width":48,"height":48,"depth":24,"url":"http://192.168.1.14:8080/device_icon_48.png"},{"mimeType":"image/png","width":120,"height":120,"depth":24,"url":"http://192.168.1.14:8080/device_icon_120.png"}],"services":[{"controlUrl":"http://192.168.1.14:8080/RenderingControl/ctrl","eventSubUrl":"http://192.168.1.14:8080/RenderingControl/evt","scpdUrl":"http://192.168.1.14:8080/RenderingControl/desc.xml","id":"urn:upnp-org:serviceId:RenderingControl","type":{"urn":"urn:schemas-upnp-org:service:RenderingControl:1","name":"Rendering Control"}},{"controlUrl":"http://192.168.1.14:8080/ConnectionManager/ctrl","eventSubUrl":"http://192.168.1.14:8080/ConnectionManager/evt","scpdUrl":"http://192.168.1.14:8080/ConnectionManager/desc.xml","id":"urn:upnp-org:serviceId:ConnectionManager","type":{"urn":"urn:schemas-upnp-org:service:ConnectionManager:1","name":"Connection Manager"}},{"controlUrl":"http://192.168.1.14:8080/AVTransport/ctrl","eventSubUrl":"http://192.168.1.14:8080/AVTransport/evt","scpdUrl":"http://192.168.1.14:8080/AVTransport/desc.xml","id":"urn:upnp-org:serviceId:AVTransport","type":{"urn":"urn:schemas-upnp-org:service:AVTransport:1","name":"AV Transport"}},{"controlUrl":"http://192.168.1.14:8080/Party_Control","eventSubUrl":"http://192.168.1.14:8080/Party_Event","scpdUrl":"http://192.168.1.14:8080/Party_scpd.xml","id":"urn:schemas-sony-com:serviceId:Party","type":{"urn":"urn:schemas-sony-com:service:Party:1","name":"Party"}},{"controlUrl":"http://192.168.1.14:8080/upnp/control/IRCC","eventSubUrl":"http://192.168.1.14:8080/","scpdUrl":"http://192.168.1.14:8080/IRCCSCPD.xml","id":"urn:schemas-sony-com:serviceId:IRCC","type":{"urn":"urn:schemas-sony-com:service:IRCC:1","name":"IRCC"}}]},
                               {"audioCapable":false,"videoCapable":false,"mirrorCapable":false,"serviceKey":"genericDeviceService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"udn":"uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6","friendlyname":"PHANTOM: PJ:","devicetype":"urn:schemas-upnp-org:device:MediaServer:1","manufacturer":"Microsoft Corporation","manufacturerurl":"http://www.microsoft.com","modelname":"Windows Media Player Sharing","modelnumber":12,"modelurl":"http://go.microsoft.com/fwlink/?LinkId=105926","serialnumber":"S-1-5-21-3363673605-2941483931-4237067410-1001","iconlist":{"icon":[{"mimetype":"image/jpeg","width":120,"height":120,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:60dc23b8-6ae5-4c44-997c-47789f12a062"},{"mimetype":"image/png","width":120,"height":120,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:1f9a0489-0da8-4b66-a005-d8093864b529"},{"mimetype":"image/jpeg","width":48,"height":48,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:607fae6e-6016-490b-a48f-51d58b52af48"},{"mimetype":"image/png","width":48,"height":48,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:ae31ab5a-9435-4ac7-8e21-8d24ac9e99ad"},{"mimetype":"image/bmp","width":48,"height":48,"depth":16,"url":"/upnphost/udhisapi.dll?content=uuid:8cb4523b-98f8-4bde-891a-a7513ecaa4da"},{"mimetype":"image/jpeg","width":32,"height":32,"depth":24,"url":"/upnphost/udhisapi.dll?content=uuid:4ee16b73-de27-4f4e-8e84-9d362644b8aa"},{"mimetype":"image/bmp","width":32,"height":32,"depth":16,"url":"/upnphost/udhisapi.dll?content=uuid:0189c1a4-3add-465b-89e2-7f4b0d3e9264"}]},"servicelist":{"service":[{"servicetype":"urn:schemas-upnp-org:service:ConnectionManager:1","serviceid":"urn:upnp-org:serviceId:ConnectionManager","controlurl":"/upnphost/udhisapi.dll?control=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ConnectionManager","eventsuburl":"/upnphost/udhisapi.dll?event=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ConnectionManager","scpdurl":"/upnphost/udhisapi.dll?content=uuid:a87a76b4-4738-4e37-9932-02a18e7ab89e"},{"servicetype":"urn:schemas-upnp-org:service:ContentDirectory:1","serviceid":"urn:upnp-org:serviceId:ContentDirectory","controlurl":"/upnphost/udhisapi.dll?control=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ContentDirectory","eventsuburl":"/upnphost/udhisapi.dll?event=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ContentDirectory","scpdurl":"/upnphost/udhisapi.dll?content=uuid:2f6fb3e0-9acf-4c7a-ac48-6674fa8250b5"},{"servicetype":"urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1","serviceid":"urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","controlurl":"/upnphost/udhisapi.dll?control=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","eventsuburl":"/upnphost/udhisapi.dll?event=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","scpdurl":"/upnphost/udhisapi.dll?content=uuid:f43452ce-8e3e-41ad-bca9-3fa23496b84d"}]}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.4:2869/","upnpVersion":"1.0","serialNumber":"S-1-5-21-3363673605-2941483931-4237067410-1001","type":{"urn":"urn:schemas-upnp-org:device:MediaServer:1","name":"Media Server"},"name":"PHANTOM: PJ:","manufacturer":{"name":"Microsoft Corporation","url":"http://www.microsoft.com"},"model":{"number":12,"name":"Windows Media Player Sharing","url":"http://go.microsoft.com/fwlink/?LinkId=105926","udn":"uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6"},"icons":[{"mimeType":"image/jpeg","width":120,"height":120,"depth":24,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:60dc23b8-6ae5-4c44-997c-47789f12a062"},{"mimeType":"image/png","width":120,"height":120,"depth":24,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:1f9a0489-0da8-4b66-a005-d8093864b529"},{"mimeType":"image/jpeg","width":48,"height":48,"depth":24,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:607fae6e-6016-490b-a48f-51d58b52af48"},{"mimeType":"image/png","width":48,"height":48,"depth":24,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:ae31ab5a-9435-4ac7-8e21-8d24ac9e99ad"},{"mimeType":"image/bmp","width":48,"height":48,"depth":16,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:8cb4523b-98f8-4bde-891a-a7513ecaa4da"},{"mimeType":"image/jpeg","width":32,"height":32,"depth":24,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:4ee16b73-de27-4f4e-8e84-9d362644b8aa"},{"mimeType":"image/bmp","width":32,"height":32,"depth":16,"url":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:0189c1a4-3add-465b-89e2-7f4b0d3e9264"}],"services":[{"controlUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?control=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ConnectionManager","eventSubUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?event=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ConnectionManager","scpdUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:a87a76b4-4738-4e37-9932-02a18e7ab89e","id":"urn:upnp-org:serviceId:ConnectionManager","type":{"urn":"urn:schemas-upnp-org:service:ConnectionManager:1","name":"Connection Manager"}},{"controlUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?control=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ContentDirectory","eventSubUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?event=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:upnp-org:serviceId:ContentDirectory","scpdUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:2f6fb3e0-9acf-4c7a-ac48-6674fa8250b5","id":"urn:upnp-org:serviceId:ContentDirectory","type":{"urn":"urn:schemas-upnp-org:service:ContentDirectory:1","name":"Content Directory"}},{"controlUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?control=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","eventSubUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?event=uuid:300b7f4c-fd6e-477b-8ba1-5b688521e8b6+urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","scpdUrl":"http://192.168.1.4:2869/upnphost/udhisapi.dll?content=uuid:f43452ce-8e3e-41ad-bca9-3fa23496b84d","id":"urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar","type":{"urn":"urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1","name":"Media Receiver Registrar"}}]},
                               {"audioCapable":false,"videoCapable":false,"mirrorCapable":false,"serviceKey":"genericDeviceService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:schemas-upnp-org:device:MediaServer:1","friendlyname":"STR-DN1040","manufacturer":"Sony Corporation","manufacturerurl":"http://www.sony.net/","modeldescription":"MULTI CHANNEL AV RECEIVER","modelname":"STR-DN1040","udn":"uuid:5f9ec1b3-ed59-1900-4532-d8d43caafb4f","iconlist":{"icon":[{"mimetype":"image/jpeg","width":48,"height":48,"depth":24,"url":"/device_icon_48.jpg"},{"mimetype":"image/jpeg","width":120,"height":120,"depth":24,"url":"/device_icon_120.jpg"},{"mimetype":"image/png","width":48,"height":48,"depth":24,"url":"/device_icon_48.png"},{"mimetype":"image/png","width":120,"height":120,"depth":24,"url":"/device_icon_120.png"}]},"servicelist":{"service":[{"servicetype":"urn:schemas-upnp-org:service:ContentDirectory:1","serviceid":"urn:upnp-org:serviceId:ContentDirectory","scpdurl":"/ContentDirectory_desc.xml","controlurl":"/ContentDirectory_ctrl","eventsuburl":"/ContentDirectory_evt"},{"servicetype":"urn:schemas-upnp-org:service:ConnectionManager:1","serviceid":"urn:upnp-org:serviceId:ConnectionManager","scpdurl":"/ConnectionManager_desc.xml","controlurl":"/ConnectionManager_ctrl","eventsuburl":"/ConnectionManager_evt"}]},"presentationurl":"http://192.168.1.14"},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.14:8000/","upnpVersion":"1.0","webPage":"http://192.168.1.14","type":{"urn":"urn:schemas-upnp-org:device:MediaServer:1","name":"Media Server"},"name":"STR-DN1040","manufacturer":{"name":"Sony Corporation","url":"http://www.sony.net/"},"model":{"description":"MULTI CHANNEL AV RECEIVER","name":"STR-DN1040","udn":"uuid:5f9ec1b3-ed59-1900-4532-d8d43caafb4f"},"icons":[{"mimeType":"image/jpeg","width":48,"height":48,"depth":24,"url":"http://192.168.1.14:8000/device_icon_48.jpg"},{"mimeType":"image/jpeg","width":120,"height":120,"depth":24,"url":"http://192.168.1.14:8000/device_icon_120.jpg"},{"mimeType":"image/png","width":48,"height":48,"depth":24,"url":"http://192.168.1.14:8000/device_icon_48.png"},{"mimeType":"image/png","width":120,"height":120,"depth":24,"url":"http://192.168.1.14:8000/device_icon_120.png"}],"services":[{"controlUrl":"http://192.168.1.14:8000/ContentDirectory_ctrl","eventSubUrl":"http://192.168.1.14:8000/ContentDirectory_evt","scpdUrl":"http://192.168.1.14:8000/ContentDirectory_desc.xml","id":"urn:upnp-org:serviceId:ContentDirectory","type":{"urn":"urn:schemas-upnp-org:service:ContentDirectory:1","name":"Content Directory"}},{"controlUrl":"http://192.168.1.14:8000/ConnectionManager_ctrl","eventSubUrl":"http://192.168.1.14:8000/ConnectionManager_evt","scpdUrl":"http://192.168.1.14:8000/ConnectionManager_desc.xml","id":"urn:upnp-org:serviceId:ConnectionManager","type":{"urn":"urn:schemas-upnp-org:service:ConnectionManager:1","name":"Connection Manager"}}]},
                               {"audioCapable":true,"videoCapable":true,"mirrorCapable":false,"serviceKey":"mediaRendererService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:schemas-upnp-org:device:MediaRenderer:1","manufacturer":"Microsoft Corporation","manufacturerurl":"http://www.microsoft.com/","modelname":"Xbox 360","modelnumber":2,"modeldescription":"Xbox 360","modelurl":"http://www.xbox.com/","friendlyname":"Xbox 360","serialnumber":419744693805,"udn":"uuid:41974469-3805-2000-0000-0025ae069dab","servicelist":{"service":[{"servicetype":"urn:schemas-upnp-org:service:AVTransport:1","serviceid":"urn:upnp-org:serviceId:AVTransport","controlurl":"/Control/AVTransport","eventsuburl":"/Event/AVTransport","scpdurl":"/Content/AVTransport"},{"servicetype":"urn:schemas-upnp-org:service:ConnectionManager:1","serviceid":"urn:upnp-org:serviceId:ConnectionManager","controlurl":"/Control/ConnectionManager","eventsuburl":"/Event/ConnectionManager","scpdurl":"/Content/ConnectionManager"},{"servicetype":"urn:schemas-upnp-org:service:RenderingControl:1","serviceid":"urn:upnp-org:serviceId:RenderingControl","controlurl":"/Control/RenderingControl","eventsuburl":"/Event/RenderingControl","scpdurl":"/Content/RenderingControl"}]},"iconlist":{"icon":[{"mimetype":"image/png","width":48,"height":48,"depth":32,"url":"/xbox360.png"},{"mimetype":"image/png","width":120,"height":120,"depth":32,"url":"/xbox360large.png"},{"mimetype":"image/jpeg","width":48,"height":48,"depth":32,"url":"/xbox360.jpeg"},{"mimetype":"image/jpeg","width":120,"height":120,"depth":32,"url":"/xbox360large.jpeg"}]},"@ms:x_ms_supportswmdrm":true},"@xmlns":"urn:schemas-upnp-org:device-1-0","@xmlns:ms":"urn:microsoft-com:wmc-1-0","@xmlns:microsoft":"urn:schemas-microsoft-com:WMPNSS-1-0"},"address":"http://192.168.1.20:1025/","upnpVersion":"1.0","serialNumber":419744693805,"type":{"urn":"urn:schemas-upnp-org:device:MediaRenderer:1","name":"Media Renderer"},"name":"Xbox 360","manufacturer":{"name":"Microsoft Corporation","url":"http://www.microsoft.com/"},"model":{"number":2,"description":"Xbox 360","name":"Xbox 360","url":"http://www.xbox.com/","udn":"uuid:41974469-3805-2000-0000-0025ae069dab"},"icons":[{"mimeType":"image/png","width":48,"height":48,"depth":32,"url":"http://192.168.1.20:1025/xbox360.png"},{"mimeType":"image/png","width":120,"height":120,"depth":32,"url":"http://192.168.1.20:1025/xbox360large.png"},{"mimeType":"image/jpeg","width":48,"height":48,"depth":32,"url":"http://192.168.1.20:1025/xbox360.jpeg"},{"mimeType":"image/jpeg","width":120,"height":120,"depth":32,"url":"http://192.168.1.20:1025/xbox360large.jpeg"}],"services":[{"controlUrl":"http://192.168.1.20:1025/Control/AVTransport","eventSubUrl":"http://192.168.1.20:1025/Event/AVTransport","scpdUrl":"http://192.168.1.20:1025/Content/AVTransport","id":"urn:upnp-org:serviceId:AVTransport","type":{"urn":"urn:schemas-upnp-org:service:AVTransport:1","name":"AV Transport"}},{"controlUrl":"http://192.168.1.20:1025/Control/ConnectionManager","eventSubUrl":"http://192.168.1.20:1025/Event/ConnectionManager","scpdUrl":"http://192.168.1.20:1025/Content/ConnectionManager","id":"urn:upnp-org:serviceId:ConnectionManager","type":{"urn":"urn:schemas-upnp-org:service:ConnectionManager:1","name":"Connection Manager"}},{"controlUrl":"http://192.168.1.20:1025/Control/RenderingControl","eventSubUrl":"http://192.168.1.20:1025/Event/RenderingControl","scpdUrl":"http://192.168.1.20:1025/Content/RenderingControl","id":"urn:upnp-org:serviceId:RenderingControl","type":{"urn":"urn:schemas-upnp-org:service:RenderingControl:1","name":"Rendering Control"}}]},
                               {"mirrorCapable":true,"audioCapable":true,"videoCapable":true,"serviceKey":"chromecastService","rawResponse":{"specversion":{"major":1,"minor":0},"urlbase":"http://192.168.1.12:8008","device":{"devicetype":"urn:dial-multiscreen-org:device:dial:1","friendlyname":"VizioCast","manufacturer":"Google Inc.","modelname":"Eureka Dongle","udn":"uuid:c00cf3eb-2fcd-5a7b-00c9-c6cfedc1bfcc","iconlist":{"icon":{"mimetype":"image/png","width":98,"height":55,"depth":32,"url":"/setup/icon.png"}},"servicelist":{"service":{"servicetype":"urn:dial-multiscreen-org:service:dial:1","serviceid":"urn:dial-multiscreen-org:serviceId:dial","controlurl":"/ssdp/notfound","eventsuburl":"/ssdp/notfound","scpdurl":"/ssdp/notfound"}}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.12:8008/","upnpVersion":"1.0","type":{"urn":"urn:dial-multiscreen-org:device:dial:1","name":"DIAL Multiscreen"},"name":"VizioCast","manufacturer":{"name":"Google Inc."},"model":{"name":"Eureka Dongle","udn":"uuid:c00cf3eb-2fcd-5a7b-00c9-c6cfedc1bfcc"},"icons":[{"mimeType":"image/png","width":98,"height":55,"depth":32,"url":"http://192.168.1.12:8008/setup/icon.png"}],"services":[{"controlUrl":null,"eventSubUrl":null,"scpdUrl":null,"id":"urn:dial-multiscreen-org:serviceId:dial","type":{"urn":"urn:dial-multiscreen-org:service:dial:1","name":"DIAL Multiscreen"}}]},
                               {"mirrorCapable":true,"audioCapable":true,"videoCapable":true,"serviceKey":"matchstickService","rawResponse":{"specversion":{"major":1,"minor":0},"urlbase":"http://192.168.1.13:9431","device":{"devicetype":"urn:dial-multiscreen-org:device:dial:1","friendlyname":"Sticky","manufacturer":"openflint","modelname":"MatchStick","udn":"uuid:428408d0-abbf-11e4-a456-67e668b5fafd","iconlist":{"icon":{"mimetype":"image/png","width":98,"height":55,"depth":32,"url":"/setup/icon.png"}},"servicelist":{"service":{"servicetype":"urn:dial-multiscreen-org:service:dial:1","serviceid":"urn:dial-multiscreen-org:serviceId:dial","controlurl":"/ssdp/notfound","eventsuburl":"/ssdp/notfound","scpdurl":"/ssdp/notfound"}}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.13:9431/","upnpVersion":"1.0","type":{"urn":"urn:dial-multiscreen-org:device:dial:1","name":"DIAL Multiscreen"},"name":"Sticky","manufacturer":{"name":"openflint"},"model":{"name":"MatchStick","udn":"uuid:428408d0-abbf-11e4-a456-67e668b5fafd"},"icons":[{"mimeType":"image/png","width":98,"height":55,"depth":32,"url":"http://192.168.1.13:9431/setup/icon.png"}],"services":[{"controlUrl":null,"eventSubUrl":null,"scpdUrl":null,"id":"urn:dial-multiscreen-org:serviceId:dial","type":{"urn":"urn:dial-multiscreen-org:service:dial:1","name":"DIAL Multiscreen"}}],"langauge":"en-US","macAddress":"98:3b:16:e9:47:70","timezone":"America/Chicago","softwareVersion":"MATCHSTICK-KK.201502040000"},
                               {"mirrorCapable":true,"audioCapable":true,"videoCapable":true,"serviceKey":"firestickService","rawResponse":{"specversion":{"major":1,"minor":0},"device":{"devicetype":"urn:dial-multiscreen-org:device:dial:1","friendlyname":"Red HOT TV","manufacturer":"Amazon.com, Inc.","modelname":"FireTV Stick","udn":"uuid:3fa7198f-8d45-c40b-0000-00006e9fd5e4","servicelist":{"service":{"servicetype":"urn:dial-multiscreen-org:service:dial:1","serviceid":"urn:dial-multiscreen-org:serviceId:dial","scpdurl":"/upnp/dev/3fa7198f-8d45-c40b-0000-00006e9fd5e4/svc/dial-multiscreen-org/dial/desc","controlurl":"/upnp/dev/3fa7198f-8d45-c40b-0000-00006e9fd5e4/svc/dial-multiscreen-org/dial/action","eventsuburl":"/upnp/dev/3fa7198f-8d45-c40b-0000-00006e9fd5e4/svc/dial-multiscreen-org/dial/event"}}},"@xmlns":"urn:schemas-upnp-org:device-1-0"},"address":"http://192.168.1.22:37810/","upnpVersion":"1.0","type":{"urn":"urn:dial-multiscreen-org:device:dial:1","name":"DIAL Multiscreen"},"name":"Red HOT TV","manufacturer":{"name":"Amazon.com, Inc."},"model":{"name":"FireTV Stick","udn":"uuid:3fa7198f-8d45-c40b-0000-00006e9fd5e4"},"icons":[],"services":[{"controlUrl":"http://192.168.1.22:37810/upnp/dev/3fa7198f-8d45-c40b-0000-00006e9fd5e4/svc/dial-multiscreen-org/dial/action","eventSubUrl":"http://192.168.1.22:37810/upnp/dev/3fa7198f-8d45-c40b-0000-00006e9fd5e4/svc/dial-multiscreen-org/dial/event","scpdUrl":"http://192.168.1.22:37810/upnp/dev/3fa7198f-8d45-c40b-0000-00006e9fd5e4/svc/dial-multiscreen-org/dial/desc","id":"urn:dial-multiscreen-org:serviceId:dial","type":{"urn":"urn:dial-multiscreen-org:service:dial:1","name":"DIAL Multiscreen"}}]}];
            testDevices.forEach( device => window.self.port.emit("deviceFound", device) );
        },1000)
        
        
        /*
        var selfElement = document.getElementById("tabjs");

        function addScript(src) {
            var script = document.createElement('script');
            script.setAttribute('src', src);
            selfElement.appendChild(script);
        }
        
        var scripts = [];
        scripts.forEach( script => addScript(script) );
        */
    }
})();