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

/*
var worker = webworkify( require('./worker.js') );

worker.addEventListener( 'message', function ( event ) {
	referenceTemplate( event.data );
});

var WorkerFunctions = {
	boot: function( context ) {
		if ( localStorage.reference ) {
			page( localStorage.reference );
		}
	},

	worker: function( context ) {
		var reference = {};
		reference.book = context.params.book;
		reference.chapter = context.params.chapter;
		reference.verse = context.params.verse;
		worker.postMessage( reference ); // send the worker a message
	}
};*/