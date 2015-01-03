// External
var React = require( 'react/addons' ),
	webworkify = require('webworkify');

// Internal
//wordSearch = require( './wordSearch.js' )(),
//var wordSearchWorker = webworkify( require('./wordSearchWorker.js') );

//var wordSearchApi = require( './wordSearchAPI.js' );

/*wordSearchWorker.addEventListener( 'message', function ( event ) {
	console.log( event.data );
});*/

/*var WorkerFunctions = {
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

	}
};*/

var WordSearchResults = React.createClass( {
	render: function() {
		//wordSearchWorker.postMessage( lemma ); // send the worker a message
		//var references = wordSearchApi.getReferences( parameters );
		var referenceMarkup = this.props.references.map( function( reference ) {
			var url = reference.book + '/' + reference.chapter + '/' + reference.verse;
			return (
				<li key={ url }><a href={ url }>{ reference.book } { reference.chapter } { reference.verse }</a></li>
			);
		} );

		if ( ! referenceMarkup ) {
			referenceMarkup = 'searching';
		}

		return (
			<ol>{ referenceMarkup }</ol>
		);
	}
} );

module.exports = WordSearchResults;
