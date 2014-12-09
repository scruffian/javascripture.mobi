// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var bible = require( './bible.js' ),
	reference = require( './reference.js' );
	Tray = require( './tray.jsx' );

var Home = React.createClass( {
	handleChange: function( event ) {
		this.setState( {
			'reference': event.target.value
		} );
	},

	goToReference: function( event ) {
		event.preventDefault();
		var url = bible.parseReference( this.state.reference ).toUrl();
		page( url );
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

var Layout = React.createClass( {
	render: function() {
		return (
			<div>
				<Home />
				<div id="reference" className="reference"></div>
				<Tray />
			</div>
		);
	}
} );

module.exports = function ( context, next ) {
	React.render(
		<Layout />,
		document.getElementById('javascripture')
	);
	next();
};