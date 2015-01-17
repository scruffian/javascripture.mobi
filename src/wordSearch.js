// External
var Emitter = require( '../mixins/emitter.js' ),
	webworkify = require('webworkify');

// Internal
var wordSearchApi = require( './wordSearchAPI.js' );

// Create this as a singleton
var _wordSearch;

module.exports = function() {
	if ( ! _wordSearch ) {
		_wordSearch = new WordSearch();
	}

	return _wordSearch;
};

var WordSearch = function() {
	if ( ! ( this instanceof WordSearch ) ) {
		return new WordSearch();
	}

	this.results = [];
};

Emitter( WordSearch.prototype );

WordSearch.prototype.search = function( lemma ) {
	this.results.push( lemma );
	this.emit( 'done' );
};
