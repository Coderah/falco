var api = module.exports = {
    uniqueId: function() {
        return Date.now().toString(36);
    },
    generateName: function(token) {
        switch (token.type) {
            default:
                return api.uniqueId();
                break;
        }
    }
}
