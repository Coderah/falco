var _ = require('lodash');
var expect = require('expect.js');
var Parser = require('../../lib/parser.js');

describe('whiskers tokenization', function() {
    describe('expression', function() {
        it('single argument', testExpression('{{test}}', 
            {
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('escaping', testExpression('{{{test}}}', 
            {
                escaping: true,
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('helper', testExpression('{{foo bar}}', 
            {
                helperName: 'foo',
                arguments: [
                    { value: 'bar' }
                ]
            }
        ));

        it('multiple arguments', testExpression('{{foo bar test}}', 
            {
                arguments: [
                    { value: 'bar' },
                    { value: 'test' }
                ]
            }
        ));

        it('arguments with context', testExpression('{{bar this.test ../foo}}', 
            {
                arguments: [
                    { context: 'this', value: 'test' },
                    { context: '..', value: 'foo' }
                ]
            }
        ));
    });

    describe('block', function() {
        it('simple block', testExpression('{{#each}}{{/each}}', 
            [
                {
                    type: 'openWhiskersBlock',
                    helperName: 'each'
                },
                {
                    type: 'endWhiskersBlock',
                    helperName: 'each'
                }
            ]
        ));

        it('inner expression', testExpression('{{#each}}{{foo.bar}}{{/each}}', 
            [
                {
                    type: 'openWhiskersBlock',
                    helperName: 'each'
                },
                {
                    arguments: [
                        { context: 'foo', value: 'bar' }
                    ]
                },
                {
                    type: 'endWhiskersBlock',
                    helperName: 'each'
                }
            ]
        ));

        it('else block', testExpression('{{#each}}{{else}}{{/each}}', 
            [
                {
                    type: 'openWhiskersBlock',
                    helperName: 'each'
                },
                {
                    type: 'whiskersBlockElse'
                },
                {
                    type: 'endWhiskersBlock',
                    helperName: 'each'
                }
            ]
        ));

        it('handle loop variables', testExpression('{{#each}}{{@index}}{{/each}}', 
            [
                {
                    type: 'openWhiskersBlock',
                    helperName: 'each'
                },
                {
                    arguments: [
                        { value: '@index' }
                    ]
                },
                {
                    type: 'endWhiskersBlock',
                    helperName: 'each'
                }
            ]
        ));
    });
});

function expectToken(token, type) {
    expect(token).to.be.a(Object);

    expect(token).to.have.property('type');
    expect(token.type).to.equal(type);
}

function expectExpression(token, details, type) {
    expectToken(token, type || 'whiskersExpression');

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
}

function testExpression(expression, details) {
    return function expressionTester(done) {
        Parser(expression, function(tokens) {
            if (details instanceof Array) {
                expect(tokens.length).to.be.above(details.length - 1);

                _.each(details, function(tokenDetails, index) {
                    var token = tokens[index];

                    expectExpression(token, tokenDetails, tokenDetails.type);
                });
            } else {
                expectExpression(tokens[0], details);
            }

            done();
        });
    }
}