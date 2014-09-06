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

    // attributes in opening tag
    l.addRule(/(\w+)(?:="(.*?)")?/, function(match, attributeName, attributeValue) {
        var obj = { type: 'tagAttribute', name: attributeName };

        if (attributeValue) obj.value = attributeValue;

        return obj;
    }, ['openTag']);

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
    }, ['inElement']);

    // closing tag
    l.addRule(/(?:\/>)|(?:<\/(\w+)>)/, function(match, tagName) {
        // TODO: handle if the ending tag doesn't match our opening one.

        this.popState(this.state === 'inElement' ? 2 : undefined);

        return { type: 'closeTag', name: tagName };
    }, ['openTag', 'inElement']);
}