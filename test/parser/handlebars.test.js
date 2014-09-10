var _ = require('lodash');
var expect = require('expect.js');
var lex = require('../../lib/parser.js');

function expectToken(token, type) {
    expect(token).to.be.a(Object);

    expect(token).to.have.property('type');
    expect(token.type).to.equal(type);
}

function expectExpression(token, details, type) {
    expectToken(token, type || 'whiskersExpression');

    expect(token).to.have.property('expression');
    expect(token.expression).to.equal(expression);

    if (details instanceof Object) {
        _.each(details, function(value, key) {
            if (_.indexOf(detailsKeys, key) > -1) {
                expect(token).to.have.property(key);
                expect(token[key]).to.have(value);
            }
        });
    }
}

describe('whiskers tokenization', function() {
    describe('expression', function() {
        // TODO: single argument
        // TODO: escaping
        // TODO: scoping
        // TODO: multiple arguments
    });

    describe('block', function() {
        // TODO: expression
        // TODO: private variables
        // TODO: else statement
        // TODO: raw
    });
});