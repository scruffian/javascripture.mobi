// External
var Emitter = require( '../mixins/emitter.js' );

// Create this as a singleton
var _wordTracking;

module.exports = function() {
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
	this.trackedWords.push( lemma );
	this.emit( 'change' );
};
