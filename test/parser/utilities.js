var expect = require('expect.js');
var _ = require('lodash');
var parser = require('../../lib/parser.js');
var utils = {};

utils.expectToken = function(token, details) {
    expect(token).to.be.an(Object);

    if (details instanceof Object) {
        _.each(details, function(value, key) {
            expect(token).to.have.property(key);

            if (value instanceof Array) {
                expect(value).to.have.length(value.length);

                _.each(value, function(arg, index) {
                    var tokenArg = value[index];

                    if (arg.context) {
                        expect(tokenArg).to.have.property('context');
                        expect(tokenArg.context).to.equal(arg.context);
                    }

                    if (arg.value) {
                        expect(tokenArg).to.have.property('value');
                        expect(tokenArg.value).to.equal(arg.value);
                    }
                });
            } else {
                expect(token[key]).to.be(value);
            }
        });
    }
}

utils.expectTokens = function(expression, details, debug) {
    return function tokensExpector(done) {
        parser(expression, function(tokens) {
            if (debug) console.log(tokens);

            if (details instanceof Array) {
                expect(tokens.length).to.be.above(details.length - 1);

                _.each(details, function(tokenDetails, index) {
                    var token = tokens[index];

                    utils.expectToken(token, tokenDetails);
                });
            } else {
                utils.expectToken(tokens[0], details);
            }

            done();
        });
    };
};

module.exports = utils;