var _ = require('lodash');
var Lexer = require('./lexer.js');
var Transform = require('stream').Transform;
var util = require('util');
var path = require('path');

require('colors');

// build global Lexer instance for parser (TODO: allow multiple Lexers at a time for parallel parsing)
var l = new Lexer(function parseError(char) {
    console.error('\nunexpected character'.red);
    console.log('state:', this.state.yellow);
    console.log('previousStates: ', this.previousStates);

    var backwardsLength = 400;
    var backwardsIndex = this.index - (backwardsLength + 1);
    if (backwardsIndex < 0) {
        backwardsLength = this.index - 1;
        backwardsIndex = 0;
    }
    var forwardsLength = 100;

    var backContext = this.input.substr(backwardsIndex, backwardsLength);
    var forwardContext = this.input.substr(this.index, Math.min(this.input.length -1, forwardsLength-1));
    console.log('\n' + backContext + char.red + forwardContext);

    process.exit(1);
});

// setup html rules
require('./rules/html.js')(l);

// setup handlebars rules
require('./rules/handlebars.js')(l);

function Parser(options) {
    l.previousStates = [];
    l.setInput('');
    l.tokens = [];

    Transform.call(this, options);
    this._writableState.objectMode = false;
    this._readableState.objectMode = true;

    this.on('pipe', function(src) {
        if (src.path) {
            this.push({type: 'templateName', value: path.basename(src.path, path.extname(src.path))});
        }
    });
    
    return this;
}

util.inherits(Parser, Transform);

Parser.prototype._transform = function transform(chunk, encoding, callback){
    var string = chunk.toString();
    l.input = l.input + string;

    var self = this;
    setImmediate(function parse() {
        var token = l.lex();

        if (!token || token === 'EOF') {
            this.push({ type: 'EOF' });
            return callback();
        } else {
            if (_.isArray(token)) {
                Array.prototype.push.apply(l.tokens, token);
                Array.prototype.push.apply(stream, token);
            } else {
                l.tokens.push(token);
                self.push(token);
            }
        }

        setImmediate(parse);
    });
};

module.exports = Parser;
