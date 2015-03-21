// External
var Emitter = require('../mixins/emitter.js');
var webworkify = require('webworkify');

// Internal
var worker = webworkify(require('./worker.js'));

// Singleton
var _wordTracking;

var wordTracking = function() {
    if (!_wordTracking) {
        _wordTracking = new WordTracking();
    }

    return _wordTracking;
};

var WordTracking = function() {
    if (!(this instanceof WordTracking)) {
        return new WordTracking();
    }

    this.trackedWords = [];
};

Emitter(WordTracking.prototype);

WordTracking.prototype.add = function(lemma) {
    var lemmaObject = {};
    lemmaObject[lemma] = [];
    this.trackedWords.push(lemmaObject);
    this.emit('change');
    this.search(lemma);
};

WordTracking.prototype.remove = function(lemma) {
    this.trackedWords = this.trackedWords.filter(function(lemmaObject) {
        return Object.keys(lemmaObject)[0] !== lemma;
    });
    this.emit('change');
};

WordTracking.prototype.search = function(lemma) {
    worker.postMessage({
        task: 'search',
        parameters: {
            lemma: lemma,
            language: 'kjv',
            clusivity: 'exclusive'
        }
    }); // send the worker a message
};

WordTracking.prototype.callback = function(event) {
    var lemma = event.data.parameters.lemma;
    var newTrackedWords = this.trackedWords.map(function(lemmaObject) {
        var thisLemma = Object.keys(lemmaObject)[0];
        if (thisLemma === lemma) {
            var resultObject = {};
            resultObject[lemma] = event.data.result;
            return resultObject;
        }
        return lemmaObject;
    });
    this.trackedWords = newTrackedWords;
    this.emit('change');
};

worker.addEventListener('message', function(event) {
    wordTracking().callback(event);
});

module.exports = wordTracking;
