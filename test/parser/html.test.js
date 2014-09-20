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
                { type: 'inElement' },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        it('content', expectTokens('<p>lorem ipsum dolor sit amet</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'text', value: 'lorem ipsum dolor sit amet' },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        describe('nested', function() {
            it('one-level', expectTokens('<section><article></article></section>', 
                [
                    { type: 'openTag', name: 'section' },
                    { type: 'inElement' },
                    { type: 'openTag', name: 'article' },
                    { type: 'inElement' },
                    { type: 'closeTag', name: 'article'},
                    { type: 'closeTag', name: 'section' }
                ]
            ));
        });

        describe('attribute', function() {
            it('empty', expectTokens('<input readonly />', 
                [
                    { type: 'openTag', name: 'input' },
                    { type: 'tagAttribute', name: 'readonly' },
                    { type: 'closeTag', name: 'input' }
                ]
            ));

            it('valued', expectTokens('<a href="/home">whiskers</a>', 
                [
                    { type: 'openTag', name: 'a' },
                    { type: 'tagAttribute', name: 'href', value: '/home' },
                    { type: 'inElement' },
                    { type: 'text', value: 'whiskers' },
                    { type: 'closeTag', name: 'a' }
                ]
            ));
        });
    });
});