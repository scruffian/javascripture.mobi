// External
var Emitter = require('../mixins/emitter.js');
var webworkify = require('webworkify');

// Internal
var worker = webworkify(require('./worker.js'));

// Singleton
var _api;

var api = function() {
    if (!_api) {
        _api = new Api();
    }

    return _api;
};

var Api = function() {
    if (!(this instanceof Api)) {
        return new Api();
    }

    this.reference = [];
};

Emitter(Api.prototype);

Api.prototype.getReference = function(reference) {
    worker.postMessage({
        task: 'reference',
        parameters: {
            reference: reference,
            language: 'kjv',
            clusivity: 'exclusive'
        }
    }); // send the worker a message
};

Api.prototype.callback = function(event) {
    this.reference = event.data.result;
    this.emit('change');
};

worker.addEventListener('message', function(event) {
    api().callback(event);
});

module.exports = api;
