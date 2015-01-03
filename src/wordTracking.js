// External
var Emitter = require( '../mixins/emitter.js' ),
	webworkify = require('webworkify');

// Internal
var wordSearchWorker = webworkify( require('./wordSearchWorker.js') );

// Singleton
var _wordTracking;

var wordTracking = function() {
	if ( ! _wordTracking ) {
		_wordTracking = new WordTracking();
	}

	return _wordTracking;
};

var WordTracking = function() {
	if ( ! ( this instanceof WordTracking ) ) {
		return new WordTracking();
	}

	this.trackedWords = [];
};

Emitter( WordTracking.prototype );

WordTracking.prototype.add = function( lemma ) {
	var lemmaObject = {};
	lemmaObject[ lemma ] = [];
	this.trackedWords.push( lemmaObject );
	this.emit( 'change' );
	this.search( lemma );
};

WordTracking.prototype.search = function( lemma ) {
	wordSearchWorker.postMessage( lemma ); // send the worker a message
};

WordTracking.prototype.callback = function( results ) {
	var lemma = Object.keys( results )[0];
	var newTrackedWords = this.trackedWords.map( function ( lemmaObject ) {
		var thisLemma = Object.keys( lemmaObject )[0];
		if ( thisLemma === lemma ) {
			return results;
		}
		return lemmaObject;
	} );
	this.trackedWords = newTrackedWords;
	this.emit( 'change' );

};

wordSearchWorker.addEventListener( 'message', function ( event ) {
	wordTracking().callback( event.data );
});

module.exports = wordTracking;
