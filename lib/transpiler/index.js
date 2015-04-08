var _ = require('lodash');
var Transform = require('stream').Transform;
var util = require('util');

function Transpiler(options) {
    Transform.call(this, options);

    this._writableState.objectMode = true;
    this._readableState.objectMode = false;

    return this;
};

util.inherits(Transpiler, Transform);

Transpiler.prototype.handleToken = function (token) {
    switch (token.type) {
        case 'templateName':
        case 'startFile':
            var string = ['var ', token.value || 'template', ' = (function() {'];
            this.push(new Buffer(string.join('')));
            break;
    }
}

Transpiler.prototype._transform = function (token, encoding, callback) {
    var self = this;
    setImmediate(function() {
        if (_.isArray(token)) {
            _.each(token, self.handleToken);
        } else {
            self.handleToken(token);
        }

        callback();
    });
};

module.exports = Transpiler;
