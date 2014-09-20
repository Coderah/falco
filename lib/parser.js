var _ = require('lodash');
var Lexer = require('lex');
require('colors');

var l = new Lexer(function (char) {
    console.error('\nunexpected character'.red);
    console.log('state:', this.state.yellow);
    console.log('previousStates: ', this.previousStates);

    var backwardsLength = 400;
    var backwardsIndex = this.index - (backwardsLength + 1);
    if (backwardsIndex < 0) {
        backwardsLength = this.index - 2;
        backwardsIndex = 0;
    }
    var forwardsLength = 100;

    var backContext = this.input.substr(backwardsIndex, backwardsLength);
    var forwardContext = this.input.substr(this.index, Math.min(this.input.length -1, forwardsLength-1));
    console.log('\n' + backContext + char.red + forwardContext);

    process.exit(1);
});

l.previousStates = [];
l.setState = function(newState) {
    this.previousStates.push(this.state);
    this.state = newState;
};

l.popState = function(count) {
    if (count && typeof count === 'number') {
        this.previousStates = this.previousStates.slice(0, this.previousStates.length - count + 1);
    }

    this.state = this.previousStates.pop();
};

l.findLastTokenOfType = function(type) {
    return _.findLast(this.tokens, {type: type});
}

// setup html rules
require('./lex/html.js')(l);

// setup handlebars rules
require('./lex/handlebars.js')(l);

function Parser(string, callback) {
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
            l.tokens.push(result);
        }

        setImmediate(tick);
    }
    
    tick();
}

module.exports = Parser;