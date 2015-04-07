var whiskers = (function () {
    var uid = -1, cache = [];

    var whiskers = {};

    whiskers.cache = function(node) {
        if (!node.nodeType) return Error('invalid node');

        var elCacheId = node.attributes['data-cache-id'];

        if (!elCacheId) {
            uid++;
            cache[uid] = {};

            node.attributes['data-cache-id'] = uid;
        }

        return cache[elCacheId || uid];
    };

    return whiskers;
})(); 

var pageTemplate = (function () {
    var fragment;

    var template = function (parameters, options) {
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

        var nodes = this.nodes = fragment.cloneNode(true);

        this.bound = {
            createdDate: nodes.childNodes[0].querySelector('article>small').childNodes[1],
            title: nodes.childNodes[0].querySelector('article>h1'),
            type: nodes.childNodes[0].childNodes[0]
        };

        if (parameters) {
            this.update(parameters);
        }

        return this;
    };

    template.prototype.update = function(parameters) {
        if (!parameters) return;

        if (parameters.page) {
            if (parameters.page.createdDate) {
                this.bound.createdDate.textContent = parameters.page.createdDate;
            }

            if (parameters.page.title) {
                this.bound.title.textContent = parameters.page.title;
            }

            if (parameters.page.type) {
                var cache = whiskers.cache(this.bound.type);
                var oldValue = cache.typeValue;
                var classList = this.bound.type.classList;

                if (classList.contains(oldValue)) {
                    classList.remove(oldValue);
                }

                if (!classList.contains(parameters.page.type)) {
                    classList.add(parameters.page.type);
                }

                cache.typeValue = parameters.page.type;
            }
        }
    }

    return template;
})();
