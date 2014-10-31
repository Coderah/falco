/**
 * Adds rules for handlebars expressions to instance of Lexer
 * @param  {Lexer} l
 * @return NULL
 */
module.exports = function handlebarRules(l) {
    var _ = require('lodash');

    //// HANDLEBARS RULES ////

    // handle ending whisker blocks
    l.addRule(/\{\{\/([\w\.]+)\}\}/, function(match, helperName) {
        this.popState();

        return { type: 'endWhiskersBlock', helperName: helperName };
    }, ['inWhiskersBlock']);

    l.addRule(/\{\{else\}\}/, function(match) {
        return { type: 'whiskersBlockElse' };
    }, ['inWhiskersBlock']);

    // whisker expression
    l.addRule(/(\{{2,3})(#)?(?:([\w\-]+)\s)?((?:[\S\/\.]+?\s?)+?)(\}{2,3})/,
        function(match, opening, modifier, helperName, expressionArguments, closing) {
            var details = {};

            if (modifier) {
                details.modifier = modifier;
            }
                
            if (helperName) {
                details.helperName = helperName;
            }

            if (expressionArguments) {
                if (modifier === '#' && !helperName) {
                    details.helperName = expressionArguments;
                } else {
                    details.arguments = parseArguments(expressionArguments);
                }
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

    //// UTILITIES ////

    var argumentRegex = /(?:([\S]+)?(?:\/|\.))?([\S]+)/;

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
