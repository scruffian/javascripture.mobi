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
	handleMouseMove: function( event ) {
		this.setChapter( event.clientX );
	},
	handleTouchMove: function( event ) {
		this.setChapter( event.clientX );
	},
	setChapter: function( clientX ) {
		var width = this.getDOMNode().offsetWidth;
		var spacing =  width / this.props.chapters;
		var chapter = Math.ceil( clientX / spacing );

	//if ( ! event.clientX ) {
	//	var position = event.originalEvent.touches[0].clientX - $(this).offset().left;
	//}

		this.setState( {
			'chapter': chapter
		} );
	},
	render: function() {
		return (
			<div onMouseMove={ this.handleMouseMove } onTouchMove={ this.handleTouchMove }>{ this.props.name } { this.state.chapter }</div>
		);
	}
} );

var BookList = React.createClass( {
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
			<div>{ books }</div>
		);
	}
} );

var Layout = React.createClass( {
	render: function() {
		return (
			<div>
				<Home />
				<div id="reference"></div>
				<BookList />
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