var expect = require('expect.js');

var utils = require('./utilities.js');
var expectTokens = utils.expectTokens;

describe('html tokenization', function() {
    describe('element', function() {
        it('self-closing', expectTokens('<br />', [
            { type: 'openTag', name: 'br' },
            { type: 'closeTag', name: 'br' }
        ]));

        it('opening and closing', expectTokens('<p></p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inTag' },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        it('content', expectTokens('<p>lorem ipsum dolor sit amet</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inTag' },
                { type: 'text', value: 'lorem ipsum dolor sit amet' },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        describe('nested', function() {
            it('one-level', expectTokens('<section><article></article></section>', 
                [
                    { type: 'openTag', name: 'section' },
                    { type: 'inTag' },
                    { type: 'openTag', name: 'article' },
                    { type: 'inTag' },
                    { type: 'closeTag', name: 'article'},
                    { type: 'closeTag', name: 'section' }
                ]
            ));
        });

        describe('attribute', function() {
            it('empty', expectTokens('<input readonly />', 
                [
                    { type: 'openTag', name: 'input' },
                    { type: 'attribute', name: 'readonly' },
                    { type: 'closeTag', name: 'input' }
                ]
            ));

            it('valued', expectTokens('<a href="/home">falco</a>', 
                [
                    { type: 'openTag', name: 'a' },
                    { type: 'attribute', name: 'href' },
                    { type: 'inAttribute' },
                    { type: 'text', value: '/home' },
                    { type: 'closeAttribute' },
                    { type: 'inTag' },
                    { type: 'text', value: 'falco' },
                    { type: 'closeTag', name: 'a' }
                ]
            ));
        });
    });
});