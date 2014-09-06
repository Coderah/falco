module.exports = function(l) {
    //// HANDLEBARS RULES ////

    // whisker expression
    l.addRule(/(\{{2,3})(this\/|\.?\.\/|@|#)?([\w\-]+\s)??([\w\.]+)(\}{2,3})/,
        function(match, opening, modifier, modifierName, expression, closing) {
            var details = { expression: expression };

            if (modifier) {
                details.modifier = modifier;
                if (modifierName) details.modifierName = modifierName;
            }

            if (opening.length !== closing.length) {
                return {
                    type: 'warning',
                    message: 'ignoring broken whiskers expression (doesn\'t have matching opening and ending braces)',
                    match: match,

                    details: details
                };
            }

            var escaping = opening.length === 3 ? false : true;

            if (modifier === '#') {
                this.setState('inWhiskersBlock');

                details.type = 'openWhiskersBlock';
            } else {
                details.type = 'whiskersExpression';
            }

            return details;
        }
    , []);

    // handle ending whisker blocks
    l.addRule(/\{\{\/([\w\.]+)\}\}/, function(match, modifierName) {
        this.popState();

        return { type: 'endWhiskersBlock', modifierName: modifierName };
    }, ['inWhiskersBlock']);
}