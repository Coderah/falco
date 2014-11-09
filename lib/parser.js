var _ = require('lodash');
var Lexer = require('./lexer.js');
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
require('./lex/html.js')(l);

// setup handlebars rules
require('./lex/handlebars.js')(l);

function Parser(string, callback) {
    l.previousStates = [];
    l.setInput(string);
    l.tokens = [];

    function tick() {
        var result = l.lex();

        if (!result || result === 'EOF') {
            if (callback instanceof Function) {
                callback(l.tokens);
            }

            return;
        } else {
            if (_.isArray(result)) {
                Array.prototype.push.apply(l.tokens, result);
            } else {
                l.tokens.push(result);
            }
        }

        setImmediate(tick);
    }
    
    tick();
}

module.exports = Parser;