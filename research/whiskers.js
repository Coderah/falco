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
