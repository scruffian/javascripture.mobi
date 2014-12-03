// External
var React = require( 'react' ),
    page = require( 'page' );

React.initializeTouchEvents(true);

// Internal
var reference = require( './reference.jsx' );

function index() {
	var Index = React.createClass( {
		goToReference: function() {
			page( '/reference' );
		},

		render: function() {
			return (
				<div className="home">
					Home page
					<button onClick={ this.goToReference }>Start</button>
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