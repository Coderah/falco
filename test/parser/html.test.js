var expect = require('expect.js');
var parser = require('../../lib/parser.js');

var utils = require('./utilities.js');

describe('html tokenization', function() {
    describe('element', function() {
        it('self-closing', function(done) {
            parser('<br />', function(tokens) {
                var openToken = tokens[0];
                var closeToken = tokens[1];

                utils.expectOpenTag(openToken, 'br');
                utils.expectCloseTag(closeToken, 'br');

                done();
            });
        });

        it('opening and closing', function(done) {
            parser('<p></p>', function(tokens) {
                expect(tokens).to.have.length(3);

                var openToken = tokens[0];
                var inElementToken = tokens[1];
                var closeToken = tokens[2];

                utils.expectOpenTag(openToken, 'p');
                utils.expectToken(inElementToken, 'inElement');
                utils.expectCloseTag(closeToken, 'p');

                done();
            });
        });

        it('content', function(done) {
            var text = 'lorem ipsum dolor sit amet';
            parser('<p>' + text + '</p>', function(tokens) {
                var textToken = tokens[2];

                utils.expectToken(textToken, 'text');
                expect(textToken.value).to.equal(text);

                done();
            });
        });

        describe('nested', function() {
            it('one-level', function(done) {
                var nestedTagName = 'article';
                parser('<section><' + nestedTagName + '></' + nestedTagName + '></section>', function(tokens) {
                    var inFirstToken = tokens[1];
                    var openToken = tokens[2];
                    var closeToken = tokens[4];

                    utils.expectToken(inFirstToken, 'inElement');

                    utils.expectOpenTag(openToken, nestedTagName);
                    utils.expectCloseTag(closeToken, nestedTagName);

                    done();
                });
            });
        });

        describe('attribute', function() {
            it('empty', function(done) {
                parser('<input readonly />', function(tokens) {
                    var attributeToken = tokens[1];

                    expect(attributeToken, 'tagAttribute');
                    expect(attributeToken.name).to.equal('readonly');
                    expect(attributeToken).to.not.have.property('value');

                    done();
                });
            });

            it('valued', function(done) {
                parser('<a href="/home">whiskers</a>', function(tokens) {
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