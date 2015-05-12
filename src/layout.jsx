// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var Reference = require( './reference.jsx' ),
	Tray = require( './tray.jsx' ),
	wordTracking = require( './wordTracking.js' )();

var Layout = React.createClass( {
	getInitialState: function() {
		return {
			goto: false,
			details: false,
			search: false,
			bookmarks: false,
			settings: false
		};
	},

	changeDisplayState: function( target, open ) {
		var state = this.getInitialState();
		if ( target ) {
			if ( open ) {
				state[ target ] = true;
			} else if ( this.state[ target ] ) {
				state[ target ] = false;
			} else {
				state[ target ] = true;
			}
		}
		this.setState( state );
	},

	goToReference: function( referenceObject ) {

			var url = referenceObject.toUrl();
			page( url );
			window.scrollTo( 0, 0 );

	},

	render: function() {
		return (
			<div>
				<Reference context={ this.props.context } onGoToReference={ this.goToReference } displayState={ this.state } onChangeDisplayState={ this.changeDisplayState } />
				<Tray displayState={ this.state } onGoToReference={ this.goToReference } onChangeDisplayState={ this.changeDisplayState } wordTracking={ wordTracking } />
			</div>
		);
	}
} );


module.exports = function( context ) {
	React.render(
		<Layout context={ context } />,
		document.getElementById( 'javascripture' )
	);
};