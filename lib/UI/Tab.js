const tabs = require("sdk/tabs");
function openFocusTab(url, contentScriptFiles) {
    if (pageWorker) return pageWorker.tab.activate();

    tabs.open({
        url: url,
        onLoad: function(tab){
            pageWorker = tab.attach({
                contentScriptFile: contentScriptFiles
            });
        },
        onClose: function (tab) {
            pageWorker = null;
        }
    });
}   