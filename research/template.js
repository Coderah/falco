var whiskers = (function () {
    var cache = [];

    var whiskers = {};

    whiskers.cache = function(node) {
        if (!node.nodeType) return Error('invalid node');

        var cacheId = node.getAttribute('data-cache-id');

        if (!cacheId) {
            cache.push({});
            cacheId = cache.length - 1;

            node.setAttribute('data-cache-id', cacheId);
        }

        return cache[cacheId];
    };

    whiskers.updateClass = function(element, value, cacheName) {
        var cache = whiskers.cache(element);
        var oldValue = cache[cacheName];
        var classList = element.classList;

        if (classList.contains(oldValue)) {
            classList.remove(oldValue);
        }

        if (!classList.contains(value)) {
            classList.add(value);
        }

        cache[cacheName] = value;
    }

    whiskers.insertAfter = function(newNode, referenceNode) {
        var nextSibling = referenceNode.nextSibling;
        if (nextSibling) {
            referenceNode.parentNode.insertBefore(newNode, nextSibling);
        } else {
            referenceNode.parentNode.appendChild(newNode);
        }
    }

    whiskers.nodeListToArray = function(nl) {
        var arr = [];
        for(var i = nl.length; i--; arr.unshift(nl[i]));
        return arr;
    }

    return whiskers;
})(); 

var PageTemplate = (function () {
    var fragment;

    var CommentsPartial = (function () {
        var fragment, elseFragment;

        function Template(parameters, option) {
            if (!fragment) {
                fragment = document.createDocumentFragment();

                var article = document.createElement('article');

                var h2IndexTitle = document.createElement('h2');
                h2IndexTitle.appendChild(document.createTextNode('')); // @index
                h2IndexTitle.appendChild(document.createTextNode(' - '));
                h2IndexTitle.appendChild(document.createTextNode('')); // title
                article.appendChild(h2IndexTitle);

                var smallMeta = document.createElement('small');
                smallMeta.classList.add('meta');
                smallMeta.appendChild(document.createTextNode('')); // username
                smallMeta.appendChild(document.createTextNode(' posted on '));
                smallMeta.appendChild(document.createTextNode('')); // createdDate
                article.appendChild(smallMeta);

                var paragraph = document.createElement('p');
                paragraph.appendChild(document.createTextNode('')); //content
                article.appendChild(paragraph);

                fragment.appendChild(article);
            }

            if (!elseFragment) {
                elseFragment = document.createDocumentFragment();

                var article = document.createElement('article');
                article.classList.add('message');

                var paragraph = document.createElement('p');
                paragraph.textContent = 'Be the first to comment.';

                elseFragment.appendChild(paragraph);
            }

            if (parameters) {
                this.build(parameters.hasOwnProperty('comments') && parameters.page.comments.length);
                this.update(parameters);
            } else {
                this.build();
            }

            return this;
        }

        Template.prototype.appendTo = function(node) {
            var nodes = this.nodes || this.elseNodes;

            if (nodes.length === 1) {
                node.appendChild(nodes[0]);
            } else {
                for (var i = 0; i < nodes.length; i++) {
                    node.appendChild(nodes[i]);
                }
            }
        };

        Template.prototype.build = function(condition) {
            // NOTE: this only builds each fragment once, so if we switch back and forth we don't memory churn

            if (condition && !this.nodes) {
                this.nodes = [document.importNode(fragment, true).childNodes[0]];

                this.bind();
            } else if (!this.elseNodes) {
                this.elseNodes = [document.importNode(elseFragment, true).childNodes[0]];

                // NOTE: no bind here because the else fragment is static
            }
        };

        Template.prototype.bind = function (nodeIndex) {
            // NOTE: bind is simplified because elseFragment is fully static

            if (typeof nodeIndex === 'number') {
                if (this.bound.comments.length -1 >= nodeIndex) return this.bound.comments[nodeIndex];

                return this.bound.comments[nodeIndex] = {
                    '@index': this.nodes[nodeIndex].childNodes[0].childNodes[0],
                    title: this.nodes[nodeIndex].childNodes[0].childNodes[2],
                    username: this.nodes[nodeIndex].childNodes[1].childNodes[0],
                    createdDate: this.nodes[nodeIndex].childNodes[1].childNodes[2],
                    content: this.nodes[nodeIndex].childNodes[2].childNodes[0]
                };
            } else if (this.nodes) {
                this.bound = {
                    comments: []
                };

                return this.bind(0);
            }
        };

        Template.prototype.update = function(parameters, options) {
            this.parameters = parameters;
            if (parameters.page.comments) {
                if (parameters.page.comments.length) {
                    this.build(true);

                    for (var i = 0; i < parameters.page.comments.length; i++) {
                        var node, comment = parameters.page.comments[i];

                        if (this.nodes.length -1 >= i) {
                            node = this.nodes[i];
                        } else {
                            node = document.importNode(fragment, true).childNodes[0];
                            this.nodes[i] = node;
                        }
                        
                        var bound = this.bind(i);

                        bound['@index'].textContent = i;
                        if (comment.title) bound.title.textContent = comment.title;
                        if (comment.username) bound.username.textContent = comment.username;
                        if (comment.createdDate) bound.createdDate.textContent = comment.createdDate;
                        if (comment.content) bound.content.textContent = comment.content;
                    };

                    if (this.elseNodes && this.elseNodes[0].parentElement) {
                        this.elseNodes[0].parentElement.replaceChild(this.nodes[0], this.elseNodes[0]);
                    }

                    if (parameters.page.comments.length > 1 && this.nodes[0].parentElement) {
                        for (var i = 1; i < parameters.page.comments.length; i++) {
                            var node = this.nodes[i];

                            if (!node.parentElement || node.parentElement !== this.nodes[0].parentElement) {
                                whiskers.insertAfter(node, this.nodes[0]);
                            }
                        }
                    }
                } else {
                    this.build(false);

                    if (this.nodes && this.nodes[0].parentElement) {
                        this.nodes[0].parentElement.replaceChild(this.elseNodes[0], this.nodes[0]);
                        // NOTE: if there are multiple top-level elements for the fragment we would add code
                        //       to whiskers.insertAfter those elements
                    }
                }
            }
        };

        return Template;
    })(); 

    function Template(parameters, options) {
        if (!fragment) {
            fragment = document.createDocumentFragment();

            var section = document.createElement('section');
            section.classList.add('main-section');

            var article = document.createElement('article');
            section.appendChild(article);

            var h1 = document.createElement('h1');
            article.appendChild(h1);

            var smallMeta = document.createElement('small'),
                smallMetaPublishDateText = document.createTextNode('');
            smallMeta.classList.add('meta');
            smallMeta.textContent = 'published on ';
            smallMeta.appendChild(smallMetaPublishDateText);
            article.appendChild(smallMeta);

            var p = document.createElement('p'),
                pData = [
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                    'Ipsa, est, ex, nesciunt, aliquam quia sed sequi officiis necessitatibus eum?',
                    'Fugit, nostrum, consequatur consequuntur saepe sint qui iusto corporis eaque iste quibusdam.',
                    'Provident, nulla, repellat nesciunt similique quibusdam dolor architecto delectus earum unde culpa ea minima!'
                ];

            for (var i = 0; i < 4; i++) {
                var pi = (i < 4 ? p.cloneNode(false) : p);

                pi.textContent = pData[i];
                article.appendChild(pi);
            }

            fragment.appendChild(section);

            var commentsSection = document.createElement('section');
            commentsSection.classList.add('comments');

            fragment.appendChild(commentsSection);
        }


        var nodes = this.nodes = whiskers.nodeListToArray(document.importNode(fragment, true).childNodes);

        this.bind();

        this.eachComments = new CommentsPartial(parameters);
        this.eachComments.appendTo(this.nodes[1]);

        if (parameters) {
            this.update(parameters, options);
        }

        return this;
    };

    Template.prototype.appendTo = function(node) {
        var nodes = this.nodes;

        if (nodes.length === 1) {
            node.appendChild(nodes[0]);
        } else {
            for (var i = 0; i < nodes.length; i++) {
                node.appendChild(nodes[i]);
            }
        }
    };

    Template.prototype.bind = function() {
        this.bound = {
            createdDate: this.nodes[0].querySelector('article>small').childNodes[1],
            title: this.nodes[0].querySelector('article>h1'),
            type: this.nodes[0].childNodes[0]
        };
    }

    Template.prototype.update = function(parameters, options) {
        this.parameters = parameters;
        if (!parameters) return;

        if (parameters.page) {
            if (parameters.page.createdDate) {
                this.bound.createdDate.textContent = parameters.page.createdDate;
            }

            if (parameters.page.title) {
                this.bound.title.textContent = parameters.page.title;
            }

            if (parameters.page.type) {
                whiskers.updateClass(this.bound.type, parameters.page.type, 'pageType');
            }

            if (parameters.page.comments) this.eachComments.update(parameters, options);
        }
    }

    return Template;
})();
