// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var bible = require( './bible.js' ),
	reference = require( './reference.js' ),
	Reference = require( './reference.jsx' ),
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
	getInitialState: function() {
		return {
			goto: false,
			details: false,
			search: false,
			bookmarks: false,
			settings: false
		};
	},

	changeDisplayState: function( target ) {
		var state = this.getInitialState();
		if ( this.state[ target ] ) {
			state[ target ] = false;
		} else {
			state[ target ] = true;
		}
		this.setState( state );
	},

	render: function() {
		return (
			<div>
				<Home />
				<Reference reference={ this.props.reference } displayState={ this.state } onChangeDisplayState={ this.changeDisplayState } />
				<Tray displayState={ this.state } onChangeDisplayState={ this.changeDisplayState } />
			</div>
		);
	}
} );


// External
var webworkify = require('webworkify'),
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
};

module.exports = function ( context, next ) {
	var reference = {};
	reference.book = context.params.book;
	reference.chapter = context.params.chapter;
	reference.verse = context.params.verse;

	React.render(
		<Layout reference={ reference } />,
		document.getElementById('javascripture')
	);
	//next();
};