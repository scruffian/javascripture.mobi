// External
var webworkify = require('webworkify'),
	page = require( 'page' );

var referenceTemplate = require( './reference.jsx' );
var worker = webworkify( require('./worker.js') );

worker.addEventListener( 'message', function ( event ) {
	referenceTemplate( event.data );
});

module.exports = {
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
};
