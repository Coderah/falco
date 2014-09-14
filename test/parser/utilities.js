var expect = require('expect.js');
var _ = require('lodash');
var parser = require('../../lib/parser.js');
var utils = {};

utils.expectToken = function(token, type, name) {
    expect(token).to.be.an(Object);

    expect(token).to.have.property('type');
    expect(token.type).to.equal(type);

    if (name) {
        expect(token).to.have.property('name');
        expect(token.name).to.equal(name);
    }
};

utils.expectOpenTag = function(token, tagName) { utils.expectToken(token, 'openTag', tagName); };
utils.expectCloseTag = function(token, tagName) { utils.expectToken(token, 'closeTag', tagName); };

utils.expectExpression = function(token, details, type) {
    utils.expectToken(token, type || 'whiskersExpression');

    if (details instanceof Object) {
        _.each(details, function(value, key) {
            expect(token).to.have.property(key);

            if (key === 'arguments') {
                expect(token.arguments).to.have.length(value.length);

                _.each(value, function(arg, index) {
                    var tokenArg = token.arguments[index];

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
};

utils.testExpression = function(expression, details) {
    return function expressionTester(done) {
        parser(expression, function(tokens) {
            if (details instanceof Array) {
                expect(tokens.length).to.be.above(details.length - 1);

                _.each(details, function(tokenDetails, index) {
                    var token = tokens[index];

                    utils.expectExpression(token, tokenDetails, tokenDetails.type);
                });
            } else {
                utils.expectExpression(tokens[0], details);
            }

            done();
        });
    };
};

module.exports = utils;