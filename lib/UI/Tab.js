const tabs = require("sdk/tabs");
const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Tab = Class({
    initialize: function initialize(url, contentScriptFiles){
        this._pageWorker = null;
        this._url = url;
        this._contenScriptFiles = contentScriptFiles;
    },
    openFocusTab: function openFocusTab() {
        if (this._pageWorker) return this._pageWorker.tab.activate();
        
        tabs.open({
            url: this._url,
            onLoad: (tab) => {
                this._pageWorker = tab.attach({
                    contentScriptFile: this._contentScriptFiles
                });
            },
            onClose: (tab) => {
                this._pageWorker = null;
            }
        });
    }
});

exports.Tab = Tab;