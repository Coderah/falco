var utils = require('./utilities.js');

describe('whiskers tokenization', function() {
    describe('expression', function() {
        it('single argument', utils.expectTokens('{{test}}', 
            {
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('escaping', utils.expectTokens('{{{test}}}', 
            {
                escaping: true,
                arguments: [
                    { value: 'test' }
                ]
            }
        ));

        it('helper', utils.expectTokens('{{foo bar}}', 
            {
                helperName: 'foo',
                arguments: [
                    { value: 'bar' }
                ]
            }
        ));

        it('multiple arguments', utils.expectTokens('{{foo bar test}}', 
            {
                arguments: [
                    { value: 'bar' },
                    { value: 'test' }
                ]
            }
        ));

        it('arguments with context', utils.expectTokens('{{bar this.test ../foo}}', 
            {
                arguments: [
                    { context: 'this', value: 'test' },
                    { context: '..', value: 'foo' }
                ]
            }
        ));
    });

    describe('block', function() {
        it('simple block', utils.expectTokens('{{#each}}{{/each}}', 
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

        it('inner expression', utils.expectTokens('{{#each}}{{foo.bar}}{{/each}}', 
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

        it('else block', utils.expectTokens('{{#each}}{{else}}{{/each}}', 
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

        it('handle loop variables', utils.expectTokens('{{#each}}{{@index}}{{/each}}', 
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