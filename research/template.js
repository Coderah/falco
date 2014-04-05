var pageTemplate = (function () {
    var fragment, schema;

    deserializePatternSchema = [
        {
            type: 'class',
            element: function(targetEl) {
                return targetEl.childNodes[0];
            },
            deserialize: function(parameters) {
                return parameters.page.type;
            }
        },
        { // section > article > h1
            type: 'textContent',
            element: function(targetEl) {
                return targetEl.querySelector('article>h1');
            },
            deserialize: function(parameters) {
                return parameters.page.title;
            }
        },
        { // section > article > small.meta
            type: 'textContent',
            element: function(targetEl) {
                var el = targetEl.querySelector('article>small');
                if (el) return el.childNodes[1];

                return false;
            },
            deserialize: function(parameters) {
                return parameters.page.createdDate;
            }
        }
    ]

    function create(parameters, options) {
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

        (function (nodes, schema) {
            var node = nodes.childNodes[0];
            var deserializePatterns = [];
            for (var i = 0; i < schema.length; i++) {
                var element = schema[i].element(nodes);
                if (element) {
                    // TODO: Object.create may clone deserialize functions causing memory leak (research)
                    var pattern = Object.create(schema[i]);
                    pattern.element = element;
                    deserializePatterns.push(pattern);
                }
            }

            node.update = deserialize.bind(nodes, deserializePatterns);
            node.deserializePatterns = deserializePatterns;
        })(nodes, deserializePatternSchema);

        if (parameters) {
            nodes.childNodes[0].update(parameters);
        }

        return nodes.childNodes[0];
    }

    function deserialize(patterns, parameters) {
        for (var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            switch (pattern.type) {
                case 'class':
                    var className = pattern.deserialize(parameters),
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
                    pattern.value = pattern.element.textContent = pattern.deserialize(parameters) || pattern.value;
                    break;
            }
        }
    }

    return create;
})();