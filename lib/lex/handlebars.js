module.exports = function(l) {
    //// HANDLEBARS RULES ////

    // whisker expression
    // argument splitting regex (\{{2,3})(@|#|/)?([\w\-]+\s)?((?:[\w\/\.]+\s?)+?)(\}{2,3})
    // each argument with context: 
    l.addRule(/(\{{2,3})(@|#)?([\w\-]+\s)?([\S]+?(?:\/|\.))?([\w]+)(\}{2,3})/,
        function(match, opening, modifier, modifierName, context, expression, closing) {
            var details = { expression: expression };

            if (modifier) {
                details.modifier = modifier;
                if (modifierName) details.modifierName = modifierName;
            }

            if (context) {
                details.context = context.substr(0, context.length - 1);
            }

            if (opening.length !== closing.length) {
                return {
                    type: 'warning',
                    message: 'ignoring broken whiskers expression (doesn\'t have matching opening and ending braces)',
                    match: match,

                    details: details
                };
            }

            details.escaping = opening.length === 3 ? false : true;

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