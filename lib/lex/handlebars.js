module.exports = function(l) {
    var _ = require('lodash');

    //// HANDLEBARS RULES ////

    // whisker expression
    l.addRule(/(\{{2,3})(@|#|\/)?(?:([\w\-]+)\s)?((?:[\S\/\.]+?\s?)+?)(\}{2,3})/,
        function(match, opening, modifier, helperName, expressionArguments, closing) {
            var details = {};

            if (modifier) {
                details.modifier = modifier;
            }
                
            if (helperName) {
                details.helperName = helperName;
            }

            if (expressionArguments) {
                details.arguments = parseArguments(expressionArguments);
            }

            if (opening.length !== closing.length) {
                return {
                    type: 'warning',
                    message: 'ignoring broken whiskers expression (doesn\'t have matching opening and ending braces)',
                    match: match,

                    details: details
                };
            }

            details.escaping = opening.length === 3 ? true : false;

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
    
    //// UTILITIES ////

    var argumentRegex = /(?:([\S]+)?(?:\/|\.))?([\w]+)/;

    function parseArguments(args) {
        var args = args.split(' ');

        return _.map(args, function(argument) {
            var parsed = argumentRegex.exec(argument);

            if (parsed) {
                var argumentDetails = {};

                if (parsed[1]) {
                    argumentDetails.context = parsed[1];
                }

                if (parsed[2]) {
                    argumentDetails.value = parsed[2];
                }

                return argumentDetails;
            }
        });
    }
}
