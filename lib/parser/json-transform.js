var Transform = require('stream').Transform;
var util = require('util');

function JSONTransform(options) {
    Transform.call(this, options);
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;

    return this;
};

util.inherits(JSONTransform, Transform);

JSONTransform.prototype._transform = function transform(chunk, encoding, callback){
    this.push(new Buffer(util.inspect(chunk, { depth: null }) + '\n'));

    callback();
};

module.exports = JSONTransform;
