// External
var React = require( 'react' ),
    page = require( 'page' ),
    webworkify = require('webworkify');

React.initializeTouchEvents(true);

// Internal
var referenceTemplate = require( './reference.jsx' );
var worker = webworkify(require('./worker.js'));
worker.addEventListener('message', function ( event ) {
	referenceTemplate( event.data );
});


var reference = function( context ) {
	var reference = {};
	reference.book = context.params.book;
	reference.chapter = context.params.chapter;
	reference.verse = context.params.verse;
	worker.postMessage( reference ); // send the worker a message
};


function index() {
	var Index = React.createClass( {
		handleChange: function( event ) {
			this.setState( {
				'reference': event.target.value
			} );
		},

		goToReference: function( event ) {
			event.preventDefault();
			page( this.state.reference );
		},

		render: function() {
			return (
				<div className="home">
					<form onSubmit={ this.goToReference }>
						<input type="text" onChange={ this.handleChange } />
					</form>
				</div>
			);
		}
	} );
	React.render(
		<Index />,
		document.getElementById('javascripture')
	);
}

page( '/', index );
page( '/:book', reference );
page( '/:book/:chapter', reference );
page( '/:book/:chapter/:verse', reference );
page.start();
