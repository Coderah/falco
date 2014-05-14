var whiskers = {

    bind: function(nodes, schema) {
        var node = nodes.childNodes[0];
        var deserializePatterns = {};

        function createPattern(schema, patterns) {
            for (var i in schema) {
                if (schema[i].hasOwnProperty('element') && schema[i].element instanceof Function) {
                    var element = schema[i].element(nodes);
                    if (element) {
                        var pattern = Object.create(schema[i]);
                        pattern.element = element;
                        patterns[i] = pattern;
                    }
                } else {
                    createPattern(schema[i], patterns[i] = {});
                }
            }
        }

        createPattern(schema, deserializePatterns);

        node.update = whiskers.deserialize.bind(nodes, deserializePatterns);
    },

    deserialize: function(patterns, parameters) {
        for (var i in parameters) {
            var pattern = patterns[i];
            if (pattern && pattern.hasOwnProperty('element') && pattern.element.nodeType) {
                var parameter = parameters[i];
                switch (pattern.type) {
                    case 'class':
                        var className = parameter,
                            classList = pattern.element.classList;

                        if (pattern.value && classList.contains(pattern.value)) {
                            classList.remove(pattern.value);
                        }

                        if (!classList.contains(className)) {
                            classList.add(className);
                        }

                        pattern.value = className;

                        break;
                    case 'textContent':
                        var value = parameter;
                        if (value) {
                            pattern.element.textContent = parameter;
                        }
                        break;
                }
            } else if (patterns.hasOwnProperty(i)) {
                whiskers.deserialize(patterns[i], parameters[i]);
            }
        }
    }
};

var pageTemplate = (function () {
    var fragment, elseFragment, schema;

    var eachCommentsPartial = (function () {
        var fragment, schema;
        
        var deserializePatternSchema = {

        };

        return function (parameters, options) {
            if (!fragment) {
                
            }

            if (!elseFragment) {

            }
        };
    })();

    var deserializePatternSchema = {
        page: {
            createdDate: { // section > article > small.meta
                type: 'textContent',
                element: function(targetEl) {
                    var el = targetEl.querySelector('article>small');
                    if (el) return el.childNodes[1];

                    return false;
                }
            },
            title: { // section > article > h1
                type: 'textContent',
                element: function(targetEl) {
                    return targetEl.querySelector('article>h1');
                }
            },
            type: {
                type: 'class',
                element: function(targetEl) {
                    return targetEl.childNodes[0];
                }
            }
        }
    };

    return function (parameters, options) {
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
        }

        var nodes = fragment.cloneNode(true);

        whiskers.bind(nodes, deserializePatternSchema);

        if (parameters) {
            nodes.childNodes[0].update(parameters);
        }

        return nodes.childNodes[0];
    };
})();