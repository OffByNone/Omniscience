'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('./Constants');

var Panel = function Panel(pubSub, panels) {
    _classCallCheck(this, Panel);

    this._pubSub = pubSub;
    this._panel = panels.Panel({
        height: 415,
        contentURL: Constants.panel.html,
        contentScriptFile: Constants.panel.js
    });
    this._panel.show();
    this._panel.hide();
};

module.exports = Panel;
//# sourceMappingURL=Panel.js.map