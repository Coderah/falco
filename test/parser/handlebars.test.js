var utils = require('./utilities.js');

describe('whiskers tokenization', function() {
    describe('expression', function() {
        it('single argument', utils.testExpression('{{test}}', 
            {
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('escaping', utils.testExpression('{{{test}}}', 
            {
                escaping: true,
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('helper', utils.testExpression('{{foo bar}}', 
            {
                helperName: 'foo',
                arguments: [
                    { value: 'bar' }
                ]
            }
        ));

        it('multiple arguments', utils.testExpression('{{foo bar test}}', 
            {
                arguments: [
                    { value: 'bar' },
                    { value: 'test' }
                ]
            }
        ));

        it('arguments with context', utils.testExpression('{{bar this.test ../foo}}', 
            {
                arguments: [
                    { context: 'this', value: 'test' },
                    { context: '..', value: 'foo' }
                ]
            }
        ));
    });

    describe('block', function() {
        it('simple block', utils.testExpression('{{#each}}{{/each}}', 
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

        it('inner expression', utils.testExpression('{{#each}}{{foo.bar}}{{/each}}', 
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

        it('else block', utils.testExpression('{{#each}}{{else}}{{/each}}', 
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

        it('handle loop variables', utils.testExpression('{{#each}}{{@index}}{{/each}}', 
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