var wordSearchApi = require('./wordSearchAPI.js');
var referenceApi = require('./referenceAPI.js');

module.exports = function(self) {
    self.addEventListener('message', function(e) {
        var result;
        console.log(e.data.task);

        if (e.data.task === 'search') {
            result = wordSearchApi.getReferences(e.data.parameters);
        }
        if (e.data.task === 'reference') {
            result = referenceApi.get(e.data.parameters.reference);
        }

        if (result) {
            self.postMessage({
                task: e.data.task,
                parameters: e.data.parameters,
                result: result
            });
        }

    }, false);
};
