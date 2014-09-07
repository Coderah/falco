var expect = require('expect.js');
var lex = require('../../lib/parser.js');

function expectToken(token, type, name) {
    expect(token).to.be.a(Object);

    expect(token).to.have.property('type');
    expect(token.type).to.equal(type);

    if (name) {
        expect(token).to.have.property('name');
        expect(token.name).to.equal(name);
    }
}

function expectOpenTag(token, tagName) { expectToken(token, 'openTag', tagName); }
function expectCloseTag(token, tagName) { expectToken(token, 'closeTag', tagName); }


describe('html tokenization', function() {
    describe('element', function() {
        it('self-closing', function() {
            var tokens = lex('<br />');

            var openToken = tokens[0];
            var closeToken = tokens[1];

            expectOpenTag(openToken, 'br');
            expectCloseTag(closeToken, 'br');
        });

        it('opening and closing', function() {
            var tokens = lex('<p></p>');
            expect(tokens).to.have.length(3);

            var openToken = tokens[0];
            var inElementToken = tokens[1];
            var closeToken = tokens[2];

            expectOpenTag(openToken, 'p');
            expectToken(inElementToken, 'inElement');
            expectCloseTag(closeToken, 'p');
        });

        it('content', function() {
            var text = 'lorem ipsum dolor sit amet';
            var tokens = lex('<p>' + text + '</p>');

            var textToken = tokens[2];

            expectToken(textToken, 'text');
            expect(textToken.value).to.equal(text);
        });

        describe('nested', function() {
            it('one-level', function() {
                var nestedTagName = 'article';
                var tokens = lex('<section><' + nestedTagName + '></' + nestedTagName + '></section>');

                var inFirstToken = tokens[1];
                var openToken = tokens[2];
                var closeToken = tokens[4];

                expectToken(inFirstToken, 'inElement');

                expectOpenTag(openToken, nestedTagName);
                expectCloseTag(closeToken, nestedTagName);
            });
        });

        describe('attribute', function() {
            it('empty', function() {
                var tokens = lex('<input readonly />');

                var attributeToken = tokens[1];

                expect(attributeToken, 'tagAttribute');
                expect(attributeToken.name).to.equal('readonly');
                expect(attributeToken).to.not.have.property('value');
            });

            it('valued', function() {
                var tokens = lex('<a href="/home">whiskers</a>');

                var attributeToken = tokens[1];

                expect(attributeToken, 'tagAttribute');
                expect(attributeToken.name).to.equal('href');
                expect(attributeToken.value).to.equal('/home');
            });
        });
    });
});