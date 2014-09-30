var expect = require('expect.js');
var parser = require('../../lib/parser.js');

var utils = require('./utilities.js');
var expectTokens = utils.expectTokens;

describe('mixed tokenization', function() {
    describe('expression inside tag', function() {
        it('as only content', expectTokens('<p>{{foobar}}</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'whiskersExpression', arguments: [ { value: 'foobar' } ] },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        it('before text', expectTokens('<p>{{foobar}} test</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'whiskersExpression', arguments: [ { value: 'foobar' } ] },
                { type: 'text', value: ' test' }, 
                { type: 'closeTag', name: 'p' }
            ]
        ));

        it('after text', expectTokens('<p>test {{foobar}}</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'text', value: 'test ' }, 
                { type: 'whiskersExpression', arguments: [ { value: 'foobar' } ] },
                { type: 'closeTag', name: 'p' }
            ]
        ));

        it('in between text', expectTokens('<p>test {{foobar}} wins</p>', 
            [
                { type: 'openTag', name: 'p' },
                { type: 'inElement' },
                { type: 'text', value: 'test ' }, 
                { type: 'whiskersExpression', arguments: [ { value: 'foobar' } ] },
                { type: 'text', value: ' wins' },
                { type: 'closeTag', name: 'p' }
            ]
        ));
    });

    xit('expression inside attribute', expectTokens('<p data-action="{{action}}">foobar</p>', 
        [
            { type: 'openTag', name: 'p' },
            { type: 'openAttribute', name: 'data-action' },
            { type: 'inAttribute' },
            { type: 'whiskersExpression', arguments: [ { value: 'action' } ] },
            { type: 'closeAttribute', name: 'data-action' },
            { type: 'inElement' },
            { type: 'text', value: 'foobar' },
            { type: 'closeTag', name: 'p' }
        ]
    ));
});