var utils = require('./utilities.js');
var expectTokens = utils.expectTokens;

describe('falco tokenization', function() {
    describe('expression', function() {
        it('single argument', expectTokens('{{test}}', 
            {
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('escaping', expectTokens('{{{test}}}', 
            {
                escaping: true,
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('helper', expectTokens('{{foo bar}}', 
            {
                helperName: 'foo',
                arguments: [
                    { value: 'bar' }
                ]
            }
        ));

        it('multiple arguments', expectTokens('{{foo bar test}}', 
            {
                arguments: [
                    { value: 'bar' },
                    { value: 'test' }
                ]
            }
        ));

        it('arguments with context', expectTokens('{{bar this.test ../foo}}', 
            {
                arguments: [
                    { context: 'this', value: 'test' },
                    { context: '..', value: 'foo' }
                ]
            }
        ));
    });

    describe('block', function() {
        it('simple block', expectTokens('{{#each}}{{/each}}', 
            [
                {
                    type: 'openExpressionBlock',
                    helperName: 'each'
                },
                {
                    type: 'endExpressionBlock',
                    helperName: 'each'
                }
            ]
        ));

        it('inner expression', expectTokens('{{#each}}{{foo.bar}}{{/each}}', 
            [
                {
                    type: 'openExpressionBlock',
                    helperName: 'each'
                },
                {
                    arguments: [
                        { context: 'foo', value: 'bar' }
                    ]
                },
                {
                    type: 'endExpressionBlock',
                    helperName: 'each'
                }
            ]
        ));

        it('else block', expectTokens('{{#each}}{{else}}{{/each}}', 
            [
                {
                    type: 'openExpressionBlock',
                    helperName: 'each'
                },
                {
                    type: 'elseExpression'
                },
                {
                    type: 'endExpressionBlock',
                    helperName: 'each'
                }
            ]
        ));

        it('handle loop variables', expectTokens('{{#each}}{{@index}}{{/each}}', 
            [
                {
                    type: 'openExpressionBlock',
                    helperName: 'each'
                },
                {
                    arguments: [
                        { value: '@index' }
                    ]
                },
                {
                    type: 'endExpressionBlock',
                    helperName: 'each'
                }
            ]
        ));
    });
});