var expect = require('expect.js');
var Parser = require('../../lib/parser.js');

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
        it('self-closing', function(done) {
            Parser('<br />', function(tokens) {
                var openToken = tokens[0];
                var closeToken = tokens[1];

                expectOpenTag(openToken, 'br');
                expectCloseTag(closeToken, 'br');

                done();
            });
        });

        it('opening and closing', function(done) {
            Parser('<p></p>', function(tokens) {
                expect(tokens).to.have.length(3);

                var openToken = tokens[0];
                var inElementToken = tokens[1];
                var closeToken = tokens[2];

                expectOpenTag(openToken, 'p');
                expectToken(inElementToken, 'inElement');
                expectCloseTag(closeToken, 'p');

                done();
            });
        });

        it('content', function(done) {
            var text = 'lorem ipsum dolor sit amet';
            Parser('<p>' + text + '</p>', function(tokens) {
                var textToken = tokens[2];

                expectToken(textToken, 'text');
                expect(textToken.value).to.equal(text);

                done();
            });
        });

        describe('nested', function() {
            it('one-level', function(done) {
                var nestedTagName = 'article';
                Parser('<section><' + nestedTagName + '></' + nestedTagName + '></section>', function(tokens) {
                    var inFirstToken = tokens[1];
                    var openToken = tokens[2];
                    var closeToken = tokens[4];

                    expectToken(inFirstToken, 'inElement');

                    expectOpenTag(openToken, nestedTagName);
                    expectCloseTag(closeToken, nestedTagName);

                    done();
                });
            });
        });

        describe('attribute', function() {
            it('empty', function(done) {
                Parser('<input readonly />', function(tokens) {
                    var attributeToken = tokens[1];

                    expect(attributeToken, 'tagAttribute');
                    expect(attributeToken.name).to.equal('readonly');
                    expect(attributeToken).to.not.have.property('value');

                    done();
                });
            });

            it('valued', function(done) {
                Parser('<a href="/home">whiskers</a>', function(tokens) {
                    var attributeToken = tokens[1];

                    expect(attributeToken, 'tagAttribute');
                    expect(attributeToken.name).to.equal('href');
                    expect(attributeToken.value).to.equal('/home');

                    done();
                });
            });
        });
    });
});