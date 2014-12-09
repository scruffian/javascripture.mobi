// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var bible = require( './bible.js' ),
	reference = require( './reference.js' );

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

var BookControl = React.createClass( {
	getInitialState: function() {
		return {
			chapter: 1
		};
	},
	goToReference: function() {
		page( '/' + this.props.name + '/' + this.state.chapter );
	},
	handleMouseMove: function( event ) {
		this.setChapter( event.clientX );
	},
	handleTouchMove: function( event ) {
		this.setChapter( event.touches[0].clientX );
	},
	setChapter: function( clientX ) {
		var width = this.getDOMNode().offsetWidth,
			spacing =  width / this.props.chapters,
			chapter = Math.ceil( clientX / spacing );

		this.setState( {
			'chapter': chapter
		} );
	},
	render: function() {
		return (
			<div onClick={ this.goToReference } onTouchEnd={ this.goToReference } onMouseMove={ this.handleMouseMove } onTouchMove={ this.handleTouchMove }>
				{ this.props.name } { this.state.chapter }
			</div>
		);
	}
} );

var ReferenceSelector = React.createClass( {
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
		var books = bible.Data.books.map( function( bookArray, index ) {
			var chapters = parseInt( bible.Data.verses[ index ].length ) - 1;
			return (
				<BookControl key={ index } name={ bookArray[0] } chapters={ chapters } />
			);
		} );
		return (
			<div className="reference-selector">{ books }</div>
		);
	}
} );

var TrayButton = React.createClass( {
	openTray: function() {
		document.getElementById( this.props.id ).style.display = 'block';
	},
	render: function() {
		return (
			<button onClick={ this.openTray }>{ this.props.text }</button>
		);
	}
} );

var Tray = React.createClass( {
	render: function() {
		return (
			<div className="tray">
				<TrayButton text="Go to" id="goto" />
				<TrayButton text="Details" id="details" />
				<TrayButton text="Search" id="search" />
				<TrayButton text="Bookmarks" id="bookmarks" />
				<TrayButton text="Settings" id="settings" />
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
				<ReferenceSelector />
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