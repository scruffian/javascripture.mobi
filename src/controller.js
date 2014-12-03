var React = require( 'react' ),
    page = require( 'page' );

var Reference = require( './reference.jsx' );

function reference( context ) {
	var layout = React.render(
		<Reference params={ context.params } />,
		document.getElementById( 'javascripture' )
	);
}

function index() {
	var Index = React.createClass( {
		render: function() {
			return (
				<div className="home">
					Home page <a href="/book/chapter/verse">Start</a>
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