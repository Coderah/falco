var Lexer = require('lex');
var _ = require('lodash');

Lexer.prototype.setState = function(newState) {
    this.previousStates.push(this.state);
    this.state = newState;
};

Lexer.prototype.popState = function(count) {
    if (count && typeof count === 'number') {
        this.previousStates = this.previousStates.slice(0, this.previousStates.length - count + 1);
    }

    this.state = this.previousStates.pop();
};

Lexer.prototype.findLastTokenOfType = function(type) {
    return _.findLast(this.tokens, {type: type});
}

module.exports = Lexer;