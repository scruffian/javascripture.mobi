// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var bible = require( './bible.js' ),
	reference = require( './reference.js' )(),
	Reference = require( './reference.jsx' ),
	Tray = require( './tray.jsx' ),
	wordTracking = require( './wordTracking.js' )();

var Home = React.createClass( {

	getInitialState: function() {
		return {
			reference: bible.parseReference( 'Genesis 1' )
		};
	},

	componentWillReceiveProps: function( nextProps ) {
		if ( nextProps.reference ) {
			this.setState( {
				reference: nextProps.reference
			} );
		}
	},

	handleChange: function( event ) {
		this.setState( {
			'reference': event.target.value
		} );
	},

	goToReference: function( event ){
		event.preventDefault();
		var reference = bible.parseReference( this.state.reference );
		this.props.onGoToReference( reference );
	},

	render: function() {
		var reference = this.state.reference.toString();

		return (
			<div className="reference-input">
				<form onSubmit={ this.goToReference }>
					<input type="text" value={ reference } onChange={ this.handleChange } />
				</form>
			</div>
		);
	}
} );

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

	goToReference: function( referenceObject ){
		console.log( referenceObject.toUrl() );
		this.setState( { reference: referenceObject }, function() {
			var url = referenceObject.toUrl();
			page( url );
			reference.get( referenceObject.toObject() );
			window.scrollTo( 0, 0 );
		} );
	},

	render: function() {
		return (
			<div>
				<Home reference={ this.state.reference } onGoToReference={ this.goToReference } />
				<Reference reference={ this.props.reference } displayState={ this.state } onChangeDisplayState={ this.changeDisplayState } />
				<Tray displayState={ this.state } onGoToReference={ this.goToReference } onChangeDisplayState={ this.changeDisplayState } wordTracking={ wordTracking } />
			</div>
		);
	}
} );


// External
/*var webworkify = require('webworkify'),
	page = require( 'page' );

var worker = webworkify( require('./worker.js') );

		worker.addEventListener( 'message', function ( event ) {
			Reference.setState( event.data, function() { console.log( 'state set' ); } );
		});


workerFunctions = {
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

module.exports = function ( context, next ) {
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


	React.render(
		<Layout reference={ reference } />,
		document.getElementById('javascripture')
	);
};