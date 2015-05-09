// External
var React = require( 'react' ),
	page = require( 'page' ),
	clone = require( 'lodash-node/modern/lang/clone' );

// Internal
var api = require( './api.js' )(),
	Reference = require( './reference.jsx' ),
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
		this.setState( {
			reference: referenceObject
		}, function() {
			var url = referenceObject.toUrl();
			page( url );
			window.scrollTo( 0, 0 );
		} );
	},

	render: function() {
		return (
			<div>
				<Reference reference={ this.props.reference } onGoToReference={ this.goToReference } displayState={ this.state } onChangeDisplayState={ this.changeDisplayState } />
				<Tray displayState={ this.state } onGoToReference={ this.goToReference } onChangeDisplayState={ this.changeDisplayState } wordTracking={ wordTracking } />
			</div>
		);
	}
} );


module.exports = function( context ) {
	var reference = {},
		referenceString = '/';
	reference.book = context.params.book;
	reference.chapter = context.params.chapter;
	reference.verse = context.params.verse;

	referenceString += reference.book;
	if ( reference.chapter ) {
		referenceString += '/' + reference.chapter;
	}
	if ( reference.verse ) {
		referenceString += '/' + reference.verse;
	}
	localStorage.reference = referenceString;

	// Fire off a request to get the reference data
	var referenceArray = [

	];
	var primaryReference = clone( context.params );
	primaryReference.version = 'kjv';
	referenceArray.push( primaryReference );
	var secondaryReference = clone( context.params );
	secondaryReference.chapter = secondaryReference.chapter;
	secondaryReference.version = 'original';
	referenceArray.push( secondaryReference );

	api.getReference( [
		primaryReference,
		secondaryReference
	] );

	React.render(
		<Layout reference={ reference } />,
		document.getElementById( 'javascripture' )
	);
};