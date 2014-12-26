// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var bible = require( './bible.js' );

var BookControl = React.createClass( {
	getInitialState: function() {
		return {
			chapter: 1
		};
	},
	goToReference: function() {
		// hide the trays
		this.props.onChangeDisplayState();

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

module.exports = React.createClass( {
	handleChange: function( event ) {
		this.setState( {
			'reference': event.target.value
		} );
	},

	render: function() {
		var books = bible.Data.books.map( function( bookArray, index ) {
			var chapters = parseInt( bible.Data.verses[ index ].length ) - 1;
			return (
				<BookControl key={ index } name={ bookArray[0] } chapters={ chapters } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );
		return (
			<div className="reference-selector">{ books }</div>
		);
	}
} );