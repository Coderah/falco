var util = require('util');

module.exports = function(TokenHandler) {
    function Translator(options) {
        TokenHandler.call(this, options);

        this._readableState.objectMode = false;

        return this;
    }
    util.inherits(Translator, TokenHandler);

    Translator.prototype.handleToken = function (token) {
        switch (token.type) {
            case 'templateName':
            case 'startFile':
                var string = ['var ', token.value || 'template', ' = (function() {', 'var fragment;'];
                this.push(new Buffer(string.join('')));
                break;
            case 'EOF':
                this.push(new Buffer('return Template;})();'));
                break;
        }
    }

    return Translator;
}