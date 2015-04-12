var _ = require('lodash');
var Transform = require('stream').Transform;
var util = require('util');

function TokenHandler(options) {
    Transform.call(this, options);

    this._writableState.objectMode = true;
    this._readableState.objectMode = true;

    return this;
};

util.inherits(TokenHandler, Transform);

TokenHandler.prototype._transform = function (token, encoding, callback) {
    var self = this;
    setImmediate(function() {
        if (_.isArray(token)) {
            _.each(token, self.handleToken, self);
        } else {
            self.handleToken(token);
        }

        callback();
    });
};

module.exports = {
    // BlockCompiler: require('./block-handler')(TokenHandler),
    Translator: require('./translator')(TokenHandler)
};
