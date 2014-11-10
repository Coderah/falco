/**
 * Adds rules for HTML to instance of Lexer
 * @param  {Lexer} l
 * @return NULL
 */
module.exports = function(l) {
    //// HTML RULES ////

    // opening tag
    l.addRule(/<(\w+)/, function(match, tagName) {
        // this.storeState();
        this.setState('openTag');

        return { type: 'openTag', name: tagName };
    }, []);

    // ignore whitespace in opening tag
    l.addRule(/\s/, function() {}, [0, 'openTag'])
    //ignore comments
    l.addRule(/<!--(.*?)-->/, function() {}, [0, 'inElement']);

    // TODO: deal with malformed html (tag declaration in separate blocks)

    // attributes in opening tag
    l.addRule(/([\w\-]+)(=")?/, function(match, attributeName, hasValue) {
        var obj = { type: 'attribute', name: attributeName };

        if (hasValue) {
            this.setState('inAttribute');

            return [obj, { type: 'inAttribute' }]
        }

        return obj;
    }, ['openTag']);

    l.addRule(/"/, function(match) {
        this.popState();

        var previousToken = this.findLastTokenOfType('attribute');

        tagName = previousToken.name;

        return { type: 'closeAttribute', name: tagName };
    }, ['inAttribute'])

    // close opening tag
    l.addRule(/>/, function(match) {
        this.setState('inElement');

        return { type: 'inElement' };
    }, ['openTag'])

    // text inside element
    l.addRule(/[\s\S]/, function(match) {
        var previousToken = this.tokens[this.tokens.length - 1];

        if (match !== '\n' && match !== '\r\n') {
            if (previousToken.type === 'text') {
                previousToken.value = previousToken.value + match;
            } else {
                return { type: 'text', value: match };
            }
        }
    }, ['inAttribute', 'inWhiskersBlock', 'inElement']);

    // closing tag
    l.addRule(/(?:\/>)|(?:<\/(\w+)>)/, function(match, tagName) {
        // TODO: handle if the ending tag doesn't match our opening one.

        //handle self-closing
        if (match === '/>') {
            var previousToken = this.findLastTokenOfType('openTag');

            tagName = previousToken.name;
        }

        this.popState(this.state === 'inElement' ? 2 : undefined);

        return { type: 'closeTag', name: tagName };
    }, ['openTag', 'inElement']);
}