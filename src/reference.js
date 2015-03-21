// External
var Emitter = require('../mixins/emitter.js');
var webworkify = require('webworkify');

// Internal
var worker = webworkify(require('./worker.js'));

// Singleton
var _reference;

var reference = function() {
    if (!_reference) {
        _reference = new Reference();
    }

    return _reference;
};

var Reference = function() {
    if (!(this instanceof Reference)) {
        return new Reference();
    }

    this.reference = [];
};

Emitter(Reference.prototype);

Reference.prototype.get = function(reference) {
    console.log(reference);
    worker.postMessage({
        task: 'reference',
        parameters: {
            reference: reference,
            language: 'kjv',
            clusivity: 'exclusive'
        }
    }); // send the worker a message
};

Reference.prototype.callback = function(event) {
    this.reference = event.data.result;
    this.emit('change');
};

worker.addEventListener('message', function(event) {
    reference().callback(event);
});

module.exports = reference;
