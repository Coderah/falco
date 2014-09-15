var expect = require('expect.js');
var parser = require('../../lib/parser.js');

var utils = require('./utilities.js');

describe('html tokenization', function() {
    describe('element', function() {
        it('self-closing', utils.expectTokens('<br />', [
            { type: 'openTag', name: 'br' },
            { type: 'closeTag', name: 'br' }
        ]));

        it('opening and closing', utils.expectTokens('<p></p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        it('content', utils.expectTokens('<p>lorem ipsum dolor sit amet</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'text', value: 'lorem ipsum dolor sit amet' },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        describe('nested', function() {
            it('one-level', utils.expectTokens('<section><article></article></section>', 
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
            it('empty', utils.expectTokens('<input readonly />', 
                [
                    { type: 'openTag', name: 'input' },
                    { type: 'tagAttribute', name: 'readonly' },
                    { type: 'closeTag', name: 'input' }
                ]
            ));

            it('valued', utils.expectTokens('<a href="/home">whiskers</a>', 
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