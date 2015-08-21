const Constants = require('./Constants');

class Panel {
    constructor(pubSub, panels) {
        this._pubSub = pubSub;
        this._panel = panels.Panel({
            height: 415,
            contentURL: Constants.panel.html,
            contentScriptFile: Constants.panel.js,
        });
        this._panel.show();
        this._panel.hide();
    }
}

module.exports = Panel;